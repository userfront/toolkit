import { createMachine, assign, send, sendParent, MachineConfig } from "xstate";

// CONSTANTS

// List of all possible factors with:
// channel, strategy
// name = name of their node in the state machine
// testIs = predicate that returns true if another factor is equivalent to this one
// testOnlyFirst = predicate that returns true if this is the only first factor
// testOnlySecond = predicate that returns true if this is the only second factor
const signupFactors = {
  emailLink: {
    channel: "email",
    strategy: "link",
    name: "emailLink",
    testIs: "isEmailLink",
    testOnlyFirst: "hasOnlyEmailLinkFirstFactor",
    testOnlySecond: "hasOnlyEmailLinkSecondFactor",
    viewContext: {
      type: "emailLink",
    },
  },
  emailCode: {
    channel: "email",
    strategy: "verificationCode",
    name: "emailCode",
    testIs: "isEmailCode",
    testOnlyFirst: "hasOnlyEmailCodeFirstFactor",
    testOnlySecond: "hasOnlyEmailCodeSecondFactor",
    viewContext: {
      type: "emailCode",
      code: "",
    },
  },
  smsCode: {
    channel: "sms",
    strategy: "verificationCode",
    name: "smsCode",
    testIs: "isSmsCode",
    testOnlyFirst: "hasOnlySmsCodeFirstFactor",
    testOnlySecond: "hasOnlySmsCodeSecondFactor",
    viewContext: {
      type: "smsCode",
      phoneNumber: "",
      code: "",
    },
  },
  password: {
    channel: "email",
    strategy: "password",
    name: "password",
    testIs: "isPassword",
    testOnlyFirst: "hasOnlyPasswordFirstFactor",
    testOnlySecond: "hasOnlyPasswordSecondFactor",
    viewContext: {
      type: "password",
      password: "",
    },
  },
  totp: {
    channel: "authenticator",
    strategy: "totp",
    name: "setUpTotp",
    testIs: "isTotp",
    testOnlyFirst: "hasOnlyTotpFirstFactor",
    testOnlySecond: "hasOnlyTotpSecondFactor",
    viewContext: {
      type: "setUpTotp",
      qrCode: "",
      totpCode: "",
      totpBackupCodes: [],
      isMfaRequired: false,
      allowedSecondFactors: [],
    },
  },
  ssoProvider: {
    channel: "email",
    // No strategy, since this represents several different strategies
    strategy: "",
    name: "ssoProvider",
    testIs: "isSsoProvider",
    testOnlyFirst: "hasOnlySsoProviderFirstFactor",
    testOnlySecond: "hasOnlySsoProviderSecondFactor",
    viewContext: {},
  },
};

// UTILITY FUNCTIONS

// Create a guard/predicate that checks if the given factor
// is the only possible factor. Checks first or second factor.
const createOnlyFactorCondition = (
  factor: any,
  asSecondFactor: Boolean = false
) => {
  return (context: any) => {
    let onlyFactor;
    if (asSecondFactor) {
      onlyFactor = context.flow.secondFactors[0];
    } else {
      onlyFactor = context.flow.firstFactors[0];
    }
    return (
      onlyFactor.channel === factor.channel &&
      onlyFactor.strategy === factor.strategy
    );
  };
};

// Return true if a string is missing or empty.
const isMissing = (str: any) => {
  return typeof str !== "string" || str.length === 0;
};

// Return true if a strong has any value.
const hasValue = (str: any) => {
  return typeof str === "string" && str.length > 0;
};

// Check to see if two factors are equivalent.
const matchFactor = (a: Factor, b: Factor) => {
  return a.channel === b.channel && a.strategy === b.strategy;
};

// Get the correct target string for the given factor
const getTargetForFactor = (factor: Factor) => {
  if (!factor) {
    return "";
  }
  if (isSsoProvider(factor)) {
    return "ssoProvider";
  }
  let target: keyof typeof signupFactors;
  for (target in signupFactors) {
    if (matchFactor(factor, signupFactors[target])) {
      return target;
    }
  }
  return "";
};

// Create an error object for the case where there's no auth flow
const missingFlowError = (message: string) => ({
  statusCode: 0,
  message,
  error: {
    type: "missing_flow_error",
  },
});

// An unhandled error object
const unhandledError = {
  statusCode: 0,
  message: "UNHANDLED ERROR",
  error: {
    type: "unhandled_error",
  },
};

// CALL USERFRONT API
// Separate machine to be invoked as a service
// Purpose is to allow us to abstract away the Userfront API,
// instead use a simple model for MBT or whatever.

type CallUserfrontApiContext = {
  method: string;
  args: object;
  isDevMode: boolean;
  _devDataType: string;
  result: object;
  error: object;
};

type CallUserfrontApiEvents =
  | { type: "init" }
  | { type: "call" }
  | { type: "failure" }
  | { type: "successDev" }
  | { type: "success" };

// Just some mock data to allow messing with the state machine
const _mockSuccess = {
  signupFirst: {
    isMfaRequired: true,
    authentication: {
      firstFactor: { channel: "email", strategy: "verificationCode" },
      secondFactors: [
        { channel: "sms", strategy: "verificationCode" },
        { channel: "authenticator", strategy: "totp" },
      ],
    },
  },
  signupSecond: {
    message: "OK",
    redirectTo: "https://my.redirect.com/path",
    tokens: {
      access: "mock access token",
    },
  },
  getDefaultAuthFlow: {
    firstFactors: [
      { channel: "email", strategy: "link" },
      { channel: "email", strategy: "azure" },
      { channel: "email", strategy: "verificationCode" },
      { channel: "email", strategy: "password" },
      { channel: "sms", strategy: "verificationCode" },
      { channel: "email", strategy: "google" },
      { channel: "email", strategy: "apple" },
      { channel: "email", strategy: "github" },
    ],
    secondFactors: [
      { channel: "sms", strategy: "verificationCode" },
      { channel: "authenticator", strategy: "totp" },
    ],
    isMfaRequired: true,
  },
  getTenantId: {
    tenantId: "demo1234",
  },
  sendVerificationCode: {
    isMfaRequired: true,
    authentication: {
      firstFactor: { channel: "email", strategy: "verificationCode" },
      secondFactors: [
        { channel: "sms", strategy: "verificationCode" },
        { channel: "authenticator", strategy: "totp" },
      ],
    },
  },
  getTotpAuthenticatorQrCode: {
    qrCode:
      "https://en.wikipedia.org/wiki/QR_code#/media/File:QR_code_for_mobile_English_Wikipedia.svg",
    backupCodes: ["backup1", "backup2", "backup3"],
  },
};

const callMethod = (method: string, args?: any) => {
  console.log(`callMethod ${method}`, args);
  if (method === "signup") {
    switch (args.method) {
      case "password":
      case "passwordless":
      case "verificationCode":
        return Promise.resolve(_mockSuccess.signupFirst);
      default:
        return Promise.resolve(_mockSuccess.signupSecond);
    }
  }
  // @ts-ignore
  return Promise.resolve(_mockSuccess[method]);
};

const callUserfrontApi = createMachine({
  id: "callUserfrontApi",
  schema: {
    context: {} as CallUserfrontApiContext,
    events: {} as CallUserfrontApiEvents,
  },
  initial: "init",
  context: {} as CallUserfrontApiContext,
  states: {
    init: {
      always: [
        {
          // Succeed with some dummy data if we're in dev mode
          target: "successDev",
          cond: (context) => context.isDevMode,
        },
        {
          // Call the API method
          target: "call",
        },
      ],
    },
    call: {
      // Call the API method, await its result
      invoke: {
        src: (context) => callMethod(context.method, context.args),
        // On success, record the data
        onDone: {
          target: "success",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            result: event.data,
          })),
        },
        // On error, record the error
        onError: {
          target: "failure",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            error: event.data,
          })),
        },
      },
    },
    // If we succeeded, return "done" to the parent with the result as data
    success: {
      type: "final",
      data: (context) => context.result,
    },
    // If we failed, return "error" to the parent with the error as data
    failure: {
      type: "final",
      entry: (context) => sendParent("error", context.error),
    },
    // If we're in dev mode, return "done" to the parent with some dummy data
    // TODO dummy data generation
    successDev: {
      type: "final",
      data: {},
    },
  },
});

// TYPES

// A factor, per the Userfront API
type Factor = {
  channel: string;
  strategy: string;
};

// An auth flow, per the Userfront API
type Flow = {
  firstFactors: Factor[];
  secondFactors: Factor[];
  isMfaRequired: boolean;
};

// An error object as returned by the Userfront API
type FormError = {
  statusCode?: number | string;
  message: string;
  error: {
    type: string;
  };
};

// Config for future optional fields on the form (name etc.)
type OptionalFieldConfig = "hide" | "allow" | "require";

// Types of form in the toolkit
type FormType =
  | "signup"
  | "login"
  | "requestPasswordResetEmail"
  | "resetPassword";

// Configuration data for the form - intended to be set either by the caller
// or during initial setup steps of the form, then fixed afterward.
interface FormConfig {
  type: FormType;
  tenantId?: string;
  flow?: Flow;
  nameConfig: OptionalFieldConfig;
  usernameConfig: OptionalFieldConfig;
  phoneNumberConfig: OptionalFieldConfig;
  // Is this in compact mode i.e. hide password behind a button
  compact: boolean;
  locale: string;
  // Is this in dev mode i.e. don't call the API, use dummy data
  devMode: boolean;
  // Should we fetch the tenant's default flow from the server,
  // even if a flow was provided inline?
  shouldFetchFlow: boolean;
}

// Data about the user
interface UserData {
  email: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
}

// TYPES FOR FACTORS

// Data common to forms for all factors
interface CommonFormData {
  allowBack: boolean;
}

interface EmailLink extends CommonFormData {
  type: "emailLink";
}

interface EmailCode extends CommonFormData {
  type: "emailCode";
  code: string;
}

interface SmsCode extends CommonFormData {
  type: "smsCode";
  phoneNumber: string;
  code: string;
}

interface Password extends CommonFormData {
  type: "password";
  password: string;
}

interface SetUpTotp extends CommonFormData {
  type: "setUpTotp";
  qrCode: string;
  totpCode: string;
  totpBackupCodes: string[];
  isMfaRequired: boolean;
  allowedSecondFactors: Factor[];
}

interface Totp extends CommonFormData {
  type: "totp";
  totpCode: string;
  backupCode: string;
  useBackupCode: boolean;
}

interface ResetPassword extends CommonFormData {
  type: "resetPassword";
}

// Factor selection needs to extend Password because
// the Password view could be inlined
interface FirstFactors extends Password {
  compact: boolean;
}

interface SecondFactors extends Password {
  compact: boolean;
}

interface Message extends CommonFormData {
  type: "message";
  message: string;
}

interface Loading extends CommonFormData {
  type: "loading";
}

// A utility type that encompasses all factors.
type View =
  | EmailLink
  | EmailCode
  | SmsCode
  | Password
  | SetUpTotp
  | Totp
  | ResetPassword
  | FirstFactors
  | SecondFactors
  | Message
  | Loading;

// The full context for the signup form state machine,
// with view data parameterized by the type of view we're
// currently on.
interface SignupContext<ViewType> {
  // User data
  user: UserData;

  // Form config - fixed form state
  config: FormConfig;

  // View-specific data
  view: ViewType;

  // Transitory form state
  isSecondFactor: boolean;
  activeFactor?: Factor;
  allowedSecondFactors?: Factor[];

  // Current error (if any)
  error?: Error;
}

// Utility type aliases for each view's context
type EmailLinkContext = SignupContext<EmailLink>;
type EmailCodeContext = SignupContext<EmailCode>;
type SmsCodeContext = SignupContext<SmsCode>;
type PasswordContext = SignupContext<Password>;
type SetUpTotpContext = SignupContext<SetUpTotp>;
type FirstFactorsContext = SignupContext<FirstFactors>;
type SecondFactorsContext = SignupContext<SecondFactors>;
type LoadingContext = SignupContext<Loading>;

// EVENT TYPES

// GENERAL SHARED EVENTS

type BackEvent = {
  type: "back";
};

type FinishEvent = {
  type: "finish";
};

type ResendEvent = {
  type: "resend";
};

type RetryEvent = {
  type: "retry";
};

// USERFRONT API EVENTS
// TODO: it would be best to use types from @userfront/core here

type UserfrontApiDoneEvent = {
  type: "done";
  data: Object;
};

type UserfrontApiFetchQrCodeEvent = {
  type: "done";
  data: {
    qrCode: string;
    backupCodes: string[];
  };
};

type UserfrontApiGetTenantIdEvent = {
  type: "done";
  data: {
    tenantId?: string;
  };
};

type UserfrontApiFetchFlowEvent = {
  type: "done";
  data: Flow;
};

type UserfrontApiFactorResponseEvent = {
  type: "done";
  data: {
    isMfaRequired: boolean;
    authentication: {
      firstFactor: Factor;
      secondFactors: Factor[];
    };
  };
};

type UserfrontApiErrorEvent = {
  type: "error";
  data: FormError;
};

// VIEW-SPECIFIC EVENTS

type EmailSubmitEvent = {
  type: "submit";
  email: string;
  name?: string;
  username?: string;
};

type CodeSubmitEvent = {
  type: "submit";
  code: string;
};

type PasswordSubmitEvent = {
  type: "submit";
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  username?: string;
};

type PhoneNumberSubmitEvent = {
  type: "submit";
  phoneNumber: string;
};

type TotpCodeSubmitEvent = {
  type: "submit";
  totpCode: string;
};

type SelectFactorEvent = {
  type: "selectFactor";
  factor: Factor;
  isSecondFactor: boolean;
};

// All events used in the signup machine
type SignupMachineEvent =
  | BackEvent
  | FinishEvent
  | ResendEvent
  | RetryEvent
  | UserfrontApiDoneEvent
  | UserfrontApiErrorEvent
  | EmailSubmitEvent
  | CodeSubmitEvent
  | PasswordSubmitEvent
  | PhoneNumberSubmitEvent
  | TotpCodeSubmitEvent
  | SelectFactorEvent;

// The full type of the signup machine's config
type SignupMachineConfig = MachineConfig<
  SignupContext<View>,
  any,
  SignupMachineEvent
>;

// GUARDS / PREDICATES

// Is this factor an SSO provider?
const isSsoProvider = (factor: Factor) => {
  return (
    factor.channel === "email" &&
    (factor.strategy === "apple" ||
      factor.strategy === "azure" ||
      factor.strategy === "google" ||
      factor.strategy === "github" ||
      factor.strategy === "twitter" ||
      factor.strategy === "facebook" ||
      factor.strategy === "linkedin")
  );
};

// Is a second factor required to complete the signup or login?
const secondFactorRequired = (
  context: SignupContext<any>,
  event: UserfrontApiFactorResponseEvent
) => {
  return event.data.isMfaRequired;
};

// Same as above, but check against the view context,
// for views that don't proceed directly from API call
// to second factor selection
const secondFactorRequiredFromView = (context: SetUpTotpContext) => {
  return context.view.isMfaRequired;
};

// Do the "password" and "confirm password" fields match?
// (One of the few validations done locally.)
const passwordsMatch = (
  context: SignupContext<Password>,
  event: PasswordSubmitEvent
) => event.password === event.confirmPassword;

// Is the tenantId absent?
const isMissingTenantId = (context: SignupContext<any>) =>
  isMissing(context.config.tenantId);

// Are we in dev mode (isDevMode = true) without a flow set locally?
// This is an error state.
const isDevModeWithoutFlow = (context: SignupContext<any>) => {
  return context.config.devMode && context.config.flow == null;
};

// Are we in local mode (shouldFetchFlow = false) without a flow set locally?
// This is an error state.
const isLocalModeWithoutFlow = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow && context.config.flow == null;
};

// Is the auth flow absent?
const isMissingFlow = (context: SignupContext<any>) => {
  return context.config.flow == null;
};

// Is the form in local mode (shouldFetchFlow = false)?
const isLocalMode = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow;
};

// Is there currently no factor selected for the form?
const hasNoActiveFactor = (context: SignupContext<any>) =>
  context.activeFactor == null;

// Are we returning to the signup/login form after clicking a passwordless email link?
// If so, we need to check if a second factor is required to log in.
const isReturningFromEmailLink = (context: SignupContext<any>) => {
  // TODO implementation based off reading query string -> in UserfrontCore
  return false;
};

// Are we returning to the signup/login form after authenticating with an SSO provider?
// If so, we need to check if a second factor is required to log in.
const isReturningFromSsoFirstFactor = (context: SignupContext<any>) => {
  // TODO implementation based off reading query string -> in UserfrontCore
  return false;
};

// Is a second factor *not* required to signup/login?
// This effectively checks if we're signed in.
const secondFactorNotRequired = (context: SignupContext<any>) => {
  // TODO implementation -> in UserfrontCore
  // effectively checking if we are signed in
  return false;
};

// ACTIONS

// Clear the current error message, if any
const clearError = assign({ error: undefined });

// Set the error message from a Userfront API error
const setErrorFromApiError = assign({
  errorMessage: (context, event: UserfrontApiErrorEvent) => event.data,
});

// Create & set the error message for a password mismatch (password !== confirmPassword)
const setErrorForPasswordMismatch = (context: SignupContext<Password>) =>
  assign({
    // TODO extract string
    error: {
      statusCode: 0,
      message: "PASSWORD MISMATCH",
      error: {
        type: "password_mismatch_error",
      },
    },
  });

// Disable back actions
const disableBack = (context: SignupContext<View>) =>
  assign({
    view: {
      ...context.view,
      allowBack: false,
    },
  });

// Enable back actions
const enableBack = (context: SignupContext<View>) =>
  assign({
    view: {
      ...context.view,
      allowBack: false,
    },
  });

// Set up the view for the selected factor
const setupView = (context: SignupContext<View>, event: SelectFactorEvent) => {
  const target = getTargetForFactor(event.factor) as keyof typeof signupFactors;
  // If we're not on a factor, we must be on factor selection,
  // which extends the Password context
  if (!target) {
    return assign({
      view: {
        type: "password",
      },
    });
  }
  if (signupFactors[target]) {
    const view = signupFactors[target].viewContext;
    return assign({
      view,
    });
  }
  // We're on an unrecognized factor
  return assign({
    view: {
      type: "unknown",
    },
  });
};

// Store the user's email (and possibly name and username too)
const setEmail = assign({
  user: (context, event: EmailSubmitEvent) => ({
    email: event.email,
    name: event.name,
    username: event.username,
  }),
});

// Store the verification code so we can send it
const setCode = assign(
  (
    context: Pick<EmailCodeContext | SmsCodeContext, "view">,
    event: CodeSubmitEvent
  ) => ({
    view: {
      ...context.view,
      code: event.code,
    },
  })
);

// Store the user's password (and at least one of email, name, username) so we can send it
const setPassword = assign(
  (context: PasswordContext, event: PasswordSubmitEvent) => ({
    user: {
      email: event.email,
      name: event.name,
      username: event.username,
    },
    view: {
      ...context.view,
      password: event.password,
    },
  })
);

// Store the user's phone number so we can send it
const setPhoneNumber = assign(
  (context: SmsCodeContext, event: PhoneNumberSubmitEvent) => ({
    view: {
      ...context.view,
      phoneNumber: event.phoneNumber,
    },
  })
);

// Store the TOTP setup QR code we received from the server, so we can display it
const setQrCode = assign(
  (context: SetUpTotpContext, event: UserfrontApiFetchQrCodeEvent) => ({
    view: {
      ...context.view,
      qrCode: event.data.qrCode,
      backupCodes: event.data.backupCodes,
    },
  })
);

// Store the TOTP code the user entered, so we can send it
const setTotpCode = assign(
  (context: SetUpTotpContext, event: TotpCodeSubmitEvent) => ({
    view: {
      ...context.view,
      totpCode: event.totpCode,
    },
  })
);

const storeFactorResponse = assign(
  (context: SetUpTotpContext, event: UserfrontApiFactorResponseEvent) => ({
    view: {
      ...context.view,
      isMfaRequired: event.data.isMfaRequired,
      allowedSecondFactors: event.data.authentication?.secondFactors || [],
    },
  })
);

// Store the allowed second factors, from the response to a successful first factor login.
// allowedSecondFactors is not necessarily identical to config.flow.secondFactors, because
// the user could have specific second factors set.
const setAllowedSecondFactors = assign(
  (context: SignupContext<any>, event: UserfrontApiFactorResponseEvent) => ({
    allowedSecondFactors: event.data.authentication.secondFactors,
  })
);

// Same as above, but set from context.view instead of event.data
// for views that don't proceed directly from the API request to
// the second factor selection
const setAllowedSecondFactorsFromView = assign((context: SetUpTotpContext) => ({
  allowedSecondFactors: context.view.allowedSecondFactors,
}));

// Mark that the form should be showing & working with second factors
const markAsSecondFactor = assign({
  isSecondFactor: true,
});

// Redirect to the afterLoginPath etc. after signed in, just an alias for the Userfront API method
const redirectIfSignedIn = () => {
  // TODO implementation
  console.log("redirectIfSignedIn");
};

// Set the tenantId based on what was returned from the Userfront API, or set isDevMode = true if
// there is no tenantId set in the local Userfront SDK instance
const setTenantIdOrDevMode = (
  context: SignupContext<any>,
  event: UserfrontApiGetTenantIdEvent
) => {
  if (hasValue(event.data.tenantId)) {
    return assign({
      config: {
        ...context.config,
        tenantId: event.data.tenantId,
      },
    });
  } else {
    return assign({
      config: {
        ...context.config,
        devMode: true,
      },
    });
  }
};

// Set the auth flow based on what was returned from the Userfront API
const setFlowFromUserfrontApi = (
  context: SignupContext<any>,
  event: UserfrontApiFetchFlowEvent
) =>
  assign({
    config: {
      ...context.config,
      flow: event.data,
    },
  });

// Once we've gotten the auth flow from the Userfront server,
// if we're in preview mode we need to set the auth flow in the context
// and then, if the user had already clicked a factor button, continue
// the flow if that factor is still available.
const setFlowFromUserfrontApiAndResume = (
  context: SignupContext<any>,
  event: UserfrontApiFetchFlowEvent
) => {
  const actionList = [];
  actionList.push(
    assign({
      config: {
        ...context.config,
        flow: event.data,
      },
    })
  );
  // TODO could be no active factor (user clicked nothing)
  // TODO could be a factor not available in the server flow
  const target = getTargetForFactor(context.activeFactor!);
  actionList.push(send(target));
  return actionList;
};

// Set the active factor, the factor that we're currently viewing.
// This is really just for the specific case when we're in "preview mode"
// (a local auth flow was provided, and we were told to fetch the flow from the server)
// and the user clicks a factor.

// The factor that we're currently viewing is almost always dictated
// by the state node we're in rather than context, this
const setActiveFactor = (
  context: SignupContext<any>,
  event: SelectFactorEvent
) => ({
  config: {
    ...context.config,
    activeFactor: event.factor,
  },
});

// VIEW-SPECIFIC MACHINE CONFIGS

// Config for the "email me a link" view
const emailLinkConfig: SignupMachineConfig = {
  id: "emailLink",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the form to enter an email
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send the request
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the prior (first, second) factor selection view
        back: "#backToFactors",
      },
    },
    // Request to send the email link to the given email,
    // and report success or failure.
    send: {
      // If there's currently an error message, clear it - don't show stale errors!
      entry: "clearError",
      // Call the Userfront API login/signup with passwordless method
      invoke: {
        src: callUserfrontApi,
        // Set the method and email, and name and/or username if present, as arguments
        data: (context: EmailLinkContext, event: any) => {
          const args = {
            method: "passwordless",
            email: context.user.email,
          } as any;
          if (hasValue(context.user.name)) {
            args.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            args.username = context.user.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        // On success, show that the email was sent
        onDone: {
          target: "showEmailSent",
        },
        // On failure, store the error and return to the email entry screen so we can try again
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // The email was successfully sent, show a message
    showEmailSent: {
      on: {
        // The user asks to resend the email to the same address
        resend: "send",
        // The user presses the back button (i.e. to correct their email and send)
        back: "showForm",
      },
    },
  },
};

// Config for the "email me a code" view
// Note - nearly identical to the "text me a code" view following
const emailCodeConfig: SignupMachineConfig = {
  id: "emailCode",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the form to enter an email address
    showForm: {
      on: {
        // When the user submits, store the email locally and proceed to send it with the Userfront API
        submit: {
          actions: "setEmail",
          target: "send",
        },
        // When the user presses the back button, go back to the preceding factor selection screen
        back: "#backToFactors",
      },
    },
    // Send the code email via the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set method, email, and possibly name and username as arguments for the call
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
          } as any;
          if (hasValue(context.user.name)) {
            args.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            args.username = context.user.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        // On success, ask the user to enter the verification code
        onDone: {
          target: "showCodeForm",
        },
        // On failure, set the error message and return to the entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // Show the form asking the user to enter the verification code
    showCodeForm: {
      on: {
        // On submit, store and then verify the code
        submit: {
          actions: "setCode",
          target: "verifyCode",
        },
        // The user can ask to resend the code to the same email address
        resend: "send",
        // The user can go back to the email entry screen to use a different email address
        back: "showForm",
      },
    },
    // Check the verification code via the Userfront API
    verifyCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set the arguments and call the Userfront API method to check the verification code
        // TODO this is not quite right?
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
            verificationCode: context.view.code,
          } as any;
          return {
            method: "sendVerificationCode",
            args,
          };
        },
        onDone: [
          // If we need to enter a second factor, proceed to that step
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're signed in, redirect.
          // Show the "verified" view in case redirect fails.
          {
            actions: "redirectIfSignedIn",
            target: "showCodeVerified",
          },
        ],
        // On error, show the error message on the code entry form
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
        },
      },
    },
    // Show a "verified" view, so we have something to show if there's nowhere to redirect to
    showCodeVerified: {
      type: "final",
    },
  },
};

// State machine config for the "text me a code" view
// Virtually identical to the "email me a code" machine above - see that one for more details
const smsCodeConfig: SignupMachineConfig = {
  id: "smsCode",
  initial: "showForm",
  entry: "setupView",
  states: {
    showForm: {
      on: {
        submit: {
          actions: "setPhoneNumber",
          target: "send",
        },
        back: "#backToFactors",
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        data: (context: SmsCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            channel: "sms",
            phoneNumber: context.view.phoneNumber,
          } as any;
          if (hasValue(context.user.email)) {
            args.email = context.user.email;
          }
          if (hasValue(context.user.name)) {
            args.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            args.username = context.user.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        onDone: {
          target: "showCodeForm",
        },
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    showCodeForm: {
      on: {
        submit: {
          actions: "setCode",
          target: "verifyCode",
        },
        resend: "send",
        back: "showForm",
      },
    },
    verifyCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        data: (context: SmsCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            channel: "sms",
            verificationCode: context.view.code,
          } as any;
          return {
            method: "sendVerificationCode",
            args,
          };
        },
        onDone: [
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showCodeVerified",
          },
        ],
        onError: {
          actions: "setErrorFromApiError",
          target: "showCodeForm",
        },
      },
    },
    showCodeVerified: {
      type: "final",
    },
  },
};

// State machine for the "username and password" view
// Note - could be running in parallel with the "select a factor" view
const passwordConfig: SignupMachineConfig = {
  id: "password",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Show the username, password, confirm password form
    showForm: {
      on: {
        submit: [
          // If password === confirmPassword, then submit the request to Userfront
          {
            actions: "setPassword",
            target: "send",
            cond: "passwordsMatch",
          },
          // If password !== confirmPassword, then show an error
          {
            actions: "setErrorForPasswordMismatch",
            target: "showForm",
          },
        ],
        // Go back to the factor selection view
        back: "#backToFactors",
      },
    },
    // Send the signup request with the Userfront API
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set email, password, and possibly name and/or username as arguments and call the method
        data: (context: PasswordContext, event: any) => {
          const args = {
            method: "password",
            email: context.user.email,
            password: context.view.password,
          } as any;
          if (hasValue(context.user.name)) {
            args.name = context.user.name;
          }
          if (hasValue(context.user.username)) {
            args.username = context.user.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        onDone: [
          // On success, proceed to second factor if required
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise we're logged in; redirect, and show a confirmation view
          {
            actions: "redirectIfSignedIn",
            target: "showPasswordSet",
          },
        ],
        // Store the error and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    // Show a confirmation view, in case we don't redirect
    showPasswordSet: {
      type: "final",
    },
  },
};

// TOTP Authenticator setup state machine config
const setUpTotpConfig: SignupMachineConfig = {
  id: "setUpTotp",
  initial: "getQrCode",
  entry: "setupView",
  states: {
    // First we need to get the QR code from the Userfront API,
    // so we can show it
    getQrCode: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getTotpAuthenticatorQrCode",
          args: {},
        }),
        // Once we have the QR code, show the form
        onDone: {
          actions: "setQrCode",
          target: "showQrCode",
        },
        // If there's a problem getting the QR code, show an error message
        onError: {
          actions: "setErrorFromApiError",
          target: "showErrorMessage",
        },
      },
    },
    // Show the form with QR code + field to verify it works
    showQrCode: {
      on: {
        // Store the TOTP code the user entered so we can verify it
        submit: {
          actions: "setTotpCode",
          target: "confirmTotpCode",
        },
        // Go back to the factor selection view
        back: "#backToFactors",
      },
    },
    // Confirm the TOTP setup is correct by using a TOTP code
    // Doesn't seem to be technically required, but it's good practice
    confirmTotpCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        // Set the code and call the API method
        data: (context: SetUpTotpContext, event: any) => ({
          method: "signup",
          args: {
            method: "totp",
            totpCode: event.totpCode,
          },
        }),
        // When verified, show the backup codes so the user can record them
        onDone: {
          actions: "storeFactorResponse",
          target: "showBackupCodes",
        },
        // On error, show the error message and return to the form
        onError: {
          actions: "setErrorFromApiError",
          target: "showQrCode",
        },
      },
    },
    // Show the user's backup codes once TOTP setup succeeds
    showBackupCodes: {
      on: {
        // Proceed to the second factor if required,
        // otherwise show a message and redirect
        finish: [
          {
            actions: "setAllowedSecondFactorsFromView",
            target: "#beginSecondFactor",
            cond: "secondFactorRequiredFromView",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showTotpSetupComplete",
          },
        ],
      },
    },
    // Show an error message only - if there's a problem getting
    // the QR code.
    showErrorMessage: {
      on: {
        retry: "getQrCode",
        back: "#backToFactors",
      },
    },
    // Show a confirmation screen, in case we don't redirect.
    showTotpSetupComplete: {
      type: "final",
    },
  },
};

const selectFactorConfig: SignupMachineConfig = {
  // The SelectFactor config needs to extend the Password config,
  // because the SelectFactor view could have the Password view inlined.
  id: "selectFactor",
  initial: "showForm",
  entry: "setupView",
  states: {
    // Bring over the Password state nodes, and override the showForm
    // node to add SelectFactor events to it.
    ...passwordConfig.states!,
    showForm: {
      on: {
        // Bring over the Password events
        ...passwordConfig.states!.showForm.on,
        // When the user selects a factor, proceed to that factor's view.
        selectFactor: [
          ...Object.values(signupFactors).map((factor) => ({
            target: `#${factor.name}`,
            cond: factor.testIs,
          })),
          // This should be exhaustive; if we fall through to here without
          // matching a factor, that means the user selected a factor we don't have a view for.

          // Duplicates, should never be reached.
          // Only here to help out the XCode visualizer.
          {
            target: "#emailLink",
            cond: "isEmailLink",
          },
          {
            target: "#emailCode",
            cond: "isEmailCode",
          },
          {
            target: "#smsCode",
            cond: "isSmsCode",
          },
          {
            target: "#password",
            cond: "isPassword",
          },
          {
            target: "#setUpTotp",
            cond: "isTotp",
          },
          {
            target: "#ssoProvider",
            cond: "isSsoProvider",
          },

          // If we get here, it's an unhandled condition, show an error
          {
            target: "#unhandledError",
          },
        ],
      },
    },
    // If we signed up with a password, no second factor is required, and
    // we didn't redirect, show the top-level "finished" state
    showPasswordSet: {
      always: "#finish",
    },
  },
};

// SIGNUP FORM MACHINE CONFIG

// Options: provide the guards and actions for the state machine as
// a separate object, so we can override them as needed for testing.
export const defaultSignupOptions = {
  guards: {
    // Predicates for first factors
    hasMultipleFirstFactors: (context: SignupContext<any>, event: any) => {
      return (context.config.flow?.firstFactors?.length ?? 0) > 1;
    },
    hasOnlyEmailLinkFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "link",
    }),
    hasOnlyEmailCodeFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "verificationCode",
    }),
    hasOnlySmsCodeFirstFactor: createOnlyFactorCondition({
      channel: "sms",
      strategy: "verificationCode",
    }),
    hasOnlyPasswordFirstFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "password",
    }),
    hasOnlyTotpFirstFactor: createOnlyFactorCondition({
      channel: "authenticator",
      strategy: "totp",
    }),
    hasOnlySsoFirstFactor: (context: SignupContext<any>) => {
      const factor = context.config.flow?.firstFactors[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for second factors
    hasMultipleSecondFactors: (context: SignupContext<any>, event: any) => {
      return (context.config.flow?.secondFactors?.length ?? 0) > 1;
    },
    hasOnlyEmailLinkSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "link",
    }),
    hasOnlyEmailCodeSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "verificationCode",
    }),
    hasOnlySmsCodeSecondFactor: createOnlyFactorCondition({
      channel: "sms",
      strategy: "verificationCode",
    }),
    hasOnlyPasswordSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "password",
    }),
    hasOnlyTotpSecondFactor: createOnlyFactorCondition({
      channel: "authenticator",
      strategy: "totp",
    }),
    hasOnlySsoSecondFactor: (context: SignupContext<any>) => {
      const factor = context.config.flow?.secondFactors[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for matching factors
    isEmailLink: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, signupFactors.emailLink);
    },
    isEmailCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, signupFactors.emailCode);
    },
    isSmsCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, signupFactors.smsCode);
    },
    isPassword: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, signupFactors.password);
    },
    isTotp: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, signupFactors.totp);
    },
    isSsoProvider: (_1: any, event: SelectFactorEvent) => {
      return isSsoProvider(event.factor);
    },

    hasNoActiveFactor,
    isLocalMode,
    isMissingFlow,
    isLocalModeWithoutFlow,
    isDevModeWithoutFlow,
    isMissingTenantId,
    passwordsMatch,
    isReturningFromEmailLink,
    isReturningFromSsoFirstFactor,
    secondFactorRequired,
    secondFactorRequiredFromView,
    secondFactorNotRequired,
  },
  actions: {
    setActiveFactor,
    setFlowFromUserfrontApiAndResume,
    setFlowFromUserfrontApi,
    setEmail,
    setPassword,
    setPhoneNumber,
    setTenantIdOrDevMode,
    setTotpCode,
    setQrCode,
    redirectIfSignedIn,
    setCode,
    setErrorFromApiError,
    clearError,
    setErrorForPasswordMismatch,
    markAsSecondFactor,
    setAllowedSecondFactors,
    setAllowedSecondFactorsFromView,
    storeFactorResponse,
    disableBack,
    enableBack,
    setupView,
  },
};

// A default context for the signup machine
// TODO this isn't really needed
export const defaultSignupContext = {
  user: {
    email: "",
  },
  config: {
    flow: {
      firstFactors: [
        { channel: "email", strategy: "link" },
        { channel: "email", strategy: "azure" },
        { channel: "email", strategy: "verificationCode" },
        { channel: "email", strategy: "password" },
        { channel: "sms", strategy: "verificationCode" },
        { channel: "email", strategy: "google" },
        { channel: "email", strategy: "apple" },
        { channel: "email", strategy: "github" },
      ],
      secondFactors: [
        { channel: "sms", strategy: "verificationCode" },
        { channel: "authenticator", strategy: "totp" },
      ],
      isMfaRequired: true,
    },
    tenantId: "demo1234",
    shouldFetchFlow: false,
    devMode: true,
    nameConfig: "hide" as OptionalFieldConfig,
    usernameConfig: "hide" as OptionalFieldConfig,
    phoneNumberConfig: "hide" as OptionalFieldConfig,
    compact: false,
    locale: "en-US",
  },
  view: {
    type: "loading",
    allowBack: false,
  } as Loading,
  isSecondFactor: false,
};

// Signup machine top-level configuration
const signupMachineConfig: SignupMachineConfig = {
  schema: {
    context: {} as SignupContext<View>,
    events: {} as SignupMachineEvent,
  },
  id: "signup",
  predictableActionArguments: true,
  initial: "init",
  states: {
    // Go back to the previous factor selection screen.
    // History node.
    // TODO this isn't working...
    back: {
      id: "backToFactors",
      type: "history",
    },
    // Start the form's loading process
    init: {
      always: [
        // If no tenant ID is provided inline/as a prop,
        // then get it from the global Userfront instance
        {
          target: "getGlobalTenantId",
          cond: "isMissingTenantId",
        },
        // If a tenant ID is present, proceed
        {
          target: "initFlow",
        },
      ],
    },
    // Get the tenant ID from the global Userfront instance
    // TODO need new method
    getGlobalTenantId: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getTenantId",
          args: {},
        }),
        // Set the tenant ID if one was present, otherwise set isDevMode = true.
        // Then proceed to start the flow.
        onDone: {
          target: "initFlow",
          actions: "setTenantIdOrDevMode",
        },
        // This error condition is handled in the initFlow step.
        onError: {
          target: "initFlow",
        },
      },
    },
    // Start the flow, if possible, or report an error.
    initFlow: {
      always: [
        // If isDevMode = true but we don't have a flow, we can't proceed.
        // Report the error.
        {
          target: "missingFlowInDevModeError",
          cond: "isDevModeWithoutFlow",
        },
        // If shouldFetchFlow = false but we don't have a flow, we can't proceed.
        // Report the error.
        {
          target: "missingFlowInLocalModeError",
          cond: "isLocalModeWithoutFlow",
        },
        // If shouldFetchFlow = true and we don't have a flow, then show a placeholder,
        // and fetch the flow from Userfront.
        {
          target: "showPlaceholderAndFetchFlow",
          cond: "isMissingFlow",
        },
        // If we have a flow and shouldFetchFlow = false, proceed to the first step.
        {
          target: "beginFlow",
          cond: "isLocalMode",
        },
        // If we have a flow and shouldFetchFlow = true, proceed to a preview of the first step;
        // the preview shouldn't proceed to a specific factor.
        // TODO probably better for this to be a placeholder in v1.
        {
          target: "showPreviewAndFetchFlow",
        },
      ],
    },
    // Report the errors above
    missingFlowInDevModeError: {
      entry: assign({ error: missingFlowError("Missing flow in dev mode") }),
    },
    missingFlowInLocalModeError: {
      entry: assign({ error: missingFlowError("Missing flow in local mode") }),
    },
    missingFlowFromServerError: {
      entry: assign({ error: missingFlowError("Missing flow from server") }),
    },
    unhandledError: {
      id: "unhandledError",
      entry: assign({ error: unhandledError }),
    },
    // Show the placeholder while fetching the flow from Userfront servers.
    showPlaceholderAndFetchFlow: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getDefaultAuthFlow",
          args: {},
        }),
        // On success, proceed to the first step
        onDone: [
          {
            target: "beginFlow",
            actions: "setFlowFromUserfrontApi",
          },
        ],
        // On failure, report an error.
        onError: [
          {
            target: "missingFlowFromServerError",
          },
        ],
      },
    },
    // Show a partially functional preview based on the locally provided flow
    // while fetching the updated flow from Userfront servers
    showPreviewAndFetchFlow: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getDefaultAuthFlow",
          args: {},
        }),
        // On success, if the user hasn't selected a factor, then proceed as normal.
        // If the user has selected a factor, proceed directly to that factor's view.
        onDone: [
          {
            target: "beginFlow",
            cond: "hasNoActiveFactor",
            actions: "setFlowFromUserfrontApi",
          },
          {
            actions: "setFlowFromUserfrontApiAndResume",
          },
        ],
        // Report errors.
        onError: [
          {
            target: "missingFlowFromServerError",
          },
        ],
      },
      on: {
        // When the user selects a factor, store it so we can proceed to it after
        // the updated flow is fetched.
        selectFactor: {
          actions: "setActiveFactor",
        },
      },
    },
    // Start the flow
    beginFlow: {
      entry: "setupView",
      always: [
        // If we're returning from authenticating via SSO, proceed to the second factor.
        {
          target: "beginSecondFactor",
          cond: "isReturningFromSsoFirstFactor",
        },
        // If we're returning from a passwordless/email link, proceed to the second factor.
        {
          target: "beginSecondFactor",
          cond: "isReturningFromEmailLink",
        },
        // If there are multiple first factors, then show the factor selection view
        {
          actions: "enableBack",
          target: "selectFirstFactor",
          cond: "hasMultipleFirstFactors",
        },
        // If the only first factor(s) are SSO providers, then show the factor selection view,
        // since it doubles as a "use SSO provider" view
        {
          target: "selectFirstFactor",
          cond: "hasOnlySsoFirstFactor",
        },
        // If a factor other than SSO is the only first factor, proceed directly to its view.
        ...Object.values(signupFactors).map((factor) => ({
          actions: "disableBack",
          target: factor.name,
          cond: factor.testOnlyFirst,
        })),
        // NOTE: this should be exhaustive; if we fall through to here without finding a next step,
        // that means that the only first factor in the flow is one we don't recognize.

        // Duplicates, should never be reached.
        // Only here to help out the XCode visualizer.
        {
          actions: "disableBack",
          target: "emailLink",
          cond: "hasOnlyEmailLinkFirstFactor",
        },
        {
          actions: "disableBack",
          target: "emailCode",
          cond: "hasOnlyEmailCodeFirstFactor",
        },
        {
          actions: "disableBack",
          target: "smsCode",
          cond: "hasOnlySmsCodeFirstFactor",
        },
        {
          actions: "disableBack",
          target: "password",
          cond: "hasOnlyPasswordFirstFactor",
        },
        {
          actions: "disableBack",
          target: "setUpTotp",
          cond: "hasOnlyTotpFirstFactor",
        },

        // Error: if we get this far, it's an unhandled situation
        {
          target: "unhandledError",
        },
      ],
    },
    // Show the first factor selection view, non-compact
    // Parallel states for the Password view and the rest of the form
    selectFirstFactor: selectFactorConfig,
    // The various factors' nested machines
    emailLink: emailLinkConfig,
    emailCode: emailCodeConfig,
    smsCode: smsCodeConfig,
    password: passwordConfig,
    setUpTotp: setUpTotpConfig,
    ssoProvider: {
      // The SSO provider buttons should directly link to SSO login,
      // with appropriate state for first/second factor, so there's nothing more to do.
      // We shouldn't even be able to get here in practice.
      type: "final",
      id: "ssoProvider",
    },
    // Check to see if a second factor is needed, and if so, proceed to the appropriate view
    beginSecondFactor: {
      id: "beginSecondFactor",
      entry: "setupView",
      always: [
        // If a second factor isn't needed, finish the flow.
        {
          target: "finish",
          cond: "secondFactorNotRequired",
        },
        // These are identical to the first factor cases:
        // If there's multiple possible second factors, proceed to factor selection
        {
          actions: "enableBack",
          target: "selectSecondFactor",
          cond: "hasMultipleSecondFactors",
        },
        // If there's only SSO providers as second factors (?!?), proceed to factor selection
        {
          target: "selectSecondFactor",
          cond: "hasOnlySsoSecondFactor",
        },
        // Otherwise, if there's only one second factor, show that factor's view
        ...Object.values(signupFactors).map((factor) => ({
          actions: "disableBack",
          target: factor.name,
          cond: factor.testOnlySecond,
        })),

        // Duplicates, should never be reached.
        // Only here to help out the XCode visualizer.
        {
          actions: "disableBack",
          target: "emailLink",
          cond: "hasOnlyEmailLinkSecondFactor",
        },
        {
          actions: "disableBack",
          target: "emailCode",
          cond: "hasOnlyEmailCodeSecondFactor",
        },
        {
          actions: "disableBack",
          target: "smsCode",
          cond: "hasOnlySmsCodeSecondFactor",
        },
        {
          actions: "disableBack",
          target: "password",
          cond: "hasOnlyPasswordSecondFactor",
        },
        {
          actions: "disableBack",
          target: "setUpTotp",
          cond: "hasOnlyTotpSecondFactor",
        },

        // If we get here, it's an unhandled error
        {
          target: "unhandledError",
        },
      ],
    },
    selectSecondFactor: {
      // When we reach here, set isSecondFactor = true so the view knows to display second factors.
      entry: "markAsSecondFactor",
      // Otherwise this is identical to the selectFirstFactor node
      ...selectFactorConfig,
    },
    // Finish the flow.
    // Redirect, or show a confirmation view.
    finish: {
      id: "finish",
      entry: "redirectIfLoggedIn",
      type: "final",
    },
  },
};

// Create a state machine for the signup flow
const createSignupMachine = (
  initialContext: SignupContext<any>,
  options: any = {}
) => {
  const machine = createMachine(signupMachineConfig, {
    ...defaultSignupOptions,
    ...options,
  }).withContext(initialContext);
  return machine;
};

export default createSignupMachine;
