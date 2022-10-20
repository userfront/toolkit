import { createMachine, assign, send, sendParent, MachineConfig } from "xstate";

// UTILITY FUNCTIONS

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

const isMissing = (str: any) => {
  return typeof str !== "string" || str.length === 0;
};

const hasValue = (str: any) => {
  return typeof str === "string" && str.length > 0;
};

const performRequest = (request: any) => {
  // TODO: implement?
  return new Promise((resolve, reject) => {
    resolve({ data: "data" });
  });
};

const isRetriableError = (response: any) => {
  // TODO: implement?
  return true;
};

// CALL USERFRONT API
// Separate machine to be invoked as a service
// Purpose is to allow us to abstract away the Userfront API,
// instead use a simple model for MBT or whatever.

type CallUserfrontApiContext = {
  method: string;
  args: object;
  isDevMode: boolean;
  devDataType: string;
  result: object;
  error: object;
};

type CallUserfrontApiEvents =
  | { type: "init" }
  | { type: "call" }
  | { type: "failure" }
  | { type: "successDev" }
  | { type: "success" };

const callMethod = (method: any, args: any) => {
  return Promise.resolve({ result: "result" });
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
          target: "successDev",
          cond: (context) => context.isDevMode,
        },
        {
          target: "call",
        },
      ],
    },
    call: {
      invoke: {
        src: (context, event) => callMethod(context.method, context.args),
        onDone: {
          target: "success",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            result: event.data,
          })),
        },
        onError: {
          target: "failure",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            error: event.data,
          })),
        },
      },
    },
    success: {
      type: "final",
      data: (context) => context.result,
    },
    failure: {
      type: "final",
      entry: (context) => sendParent("error", context.error),
    },
    successDev: {
      type: "final",
      data: {},
    },
  },
});

// GLOBAL CONTEXT

const Factors = {
  EmailLink: {
    channel: "email",
    strategy: "link",
  },
  EmailCode: {
    channel: "email",
    strategy: "verificationCode",
  },
  SmsCode: {
    channel: "sms",
    strategy: "verificationCode",
  },
  Password: {
    channel: "email",
    strategy: "password",
  },
  Totp: {
    channel: "authenticator",
    strategy: "totp",
  },
};

type Factor = {
  channel: string;
  strategy: string;
};

type Flow = {
  firstFactors: Factor[];
  secondFactors: Factor[];
  isMfaRequired: boolean;
};

type FormError = {
  statusCode?: number | string;
  message: string;
  error: {
    type: string;
  };
};

type OptionalFieldConfig = "hide" | "allow" | "require";

type FormType =
  | "signup"
  | "login"
  | "requestPasswordResetEmail"
  | "resetPassword";

interface FormConfig {
  type: FormType;
  tenantId?: string;
  flow?: Flow;
  nameConfig: OptionalFieldConfig;
  usernameConfig: OptionalFieldConfig;
  phoneNumberConfig: OptionalFieldConfig;
  compact: boolean;
  locale: string;
  devMode: boolean;
  shouldFetchFlow: boolean;
}

interface UserData {
  email: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
}

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

interface FirstFactors extends CommonFormData {
  type: "firstFactors";
  compact: boolean;
}

interface SecondFactors extends CommonFormData {
  type: "secondFactors";
}

interface Message extends CommonFormData {
  type: "message";
  message: string;
}

interface Loading extends CommonFormData {
  type: "loading";
}

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

interface SignupContext<ViewType> {
  // User data
  user: UserData;

  // Form config
  config: FormConfig;

  // View-specific data
  view: ViewType;

  // Transitory form state
  activeFactor?: Factor;
  allowedSecondFactors?: Factor[];

  // Current error (if any)
  error?: Error;
}

type EmailLinkContext = SignupContext<EmailLink>;
type EmailCodeContext = SignupContext<EmailCode>;
type SmsCodeContext = SignupContext<SmsCode>;
type PasswordContext = SignupContext<Password>;
type SetUpTotpContext = SignupContext<SetUpTotp>;
type FirstFactorsContext = SignupContext<FirstFactors>;
type SecondFactorsContext = SignupContext<SecondFactors>;
type LoadingContext = SignupContext<Loading>;

// SHARED EVENT TYPES

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

type SignupMachineConfig = MachineConfig<
  SignupContext<View>,
  any,
  SignupMachineEvent
>;

const matchFactor = (a: Factor, b: Factor) => {
  return a.channel === b.channel && a.strategy === b.strategy;
};

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

const backToFactors = send("#signup.back");

const clearError = assign({ error: undefined });

const setErrorFromApiError = assign({
  errorMessage: (context, event: UserfrontApiErrorEvent) => event.data,
});

const setEmail = assign({
  user: (context, event: EmailSubmitEvent) => ({
    email: event.email,
    name: event.name,
    username: event.username,
  }),
});

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

const setPhoneNumber = assign(
  (context: SmsCodeContext, event: PhoneNumberSubmitEvent) => ({
    view: {
      ...context.view,
      phoneNumber: event.phoneNumber,
    },
  })
);

const setQrCode = assign(
  (context: SetUpTotpContext, event: UserfrontApiFetchQrCodeEvent) => ({
    view: {
      ...context.view,
      qrCode: event.data.qrCode,
      backupCodes: event.data.backupCodes,
    },
  })
);

const setTotpCode = assign(
  (context: SetUpTotpContext, event: TotpCodeSubmitEvent) => ({
    view: {
      ...context.view,
      totpCode: event.totpCode,
    },
  })
);

const setAllowedSecondFactors = assign(
  (context: SignupContext<any>, event: UserfrontApiFactorResponseEvent) => ({
    allowedSecondFactors: event.data.authentication.secondFactors,
  })
);

const redirectIfSignedIn = () => {
  // TODO implementation
  console.log("redirectIfSignedIn");
};

const secondFactorRequired = (
  context: SignupContext<any>,
  event: UserfrontApiFactorResponseEvent
) => {
  return event.data.isMfaRequired;
};

const passwordsMatch = (
  context: SignupContext<Password>,
  event: PasswordSubmitEvent
) => event.password === event.confirmPassword;

const setErrorMessageForPasswordMismatch = (context: SignupContext<Password>) =>
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

const isMissingTenantId = (context: SignupContext<any>) =>
  isMissing(context.config.tenantId);

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

const isDevModeWithoutFlow = (context: SignupContext<any>) => {
  return context.config.devMode && context.config.flow == null;
};

const isLocalModeWithoutFlow = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow && context.config.flow == null;
};

const isMissingFlow = (context: SignupContext<any>) => {
  return context.config.flow == null;
};

const isLocalMode = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow && context.config.devMode;
};

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

const getTargetForFactor = (factor: Factor) => {
  return "target";
};

const hasNoActiveFactor = (context: SignupContext<any>) =>
  context.activeFactor == null;

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
  const target = getTargetForFactor(context.activeFactor!);
  actionList.push(send(target));
  return actionList;
};

const setActiveFactor = (
  context: SignupContext<any>,
  event: SelectFactorEvent
) => ({
  config: {
    ...context.config,
    activeFactor: event.factor,
  },
});

const emailLinkConfig: SignupMachineConfig = {
  id: "emailLink",
  initial: "showForm",
  states: {
    showForm: {
      on: {
        submit: {
          actions: "setEmail",
          target: "send",
        },
        back: {
          actions: "#backToFactors",
        },
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
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
        onDone: {
          target: "showEmailSent",
        },
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    showEmailSent: {
      on: {
        resend: "send",
        back: "showForm",
      },
    },
  },
};

const emailCodeConfig: SignupMachineConfig = {
  id: "emailCode",
  initial: "showForm",
  states: {
    showForm: {
      on: {
        submit: {
          actions: "setEmail",
          target: "send",
        },
        back: {
          actions: "#backToFactors",
        },
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
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
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
          } as any;
          return {
            method: "verifyCode",
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

const smsCodeConfig: SignupMachineConfig = {
  id: "smsCode",
  initial: "showForm",
  states: {
    showForm: {
      on: {
        submit: {
          actions: "setPhoneNumber",
          target: "send",
        },
        back: {
          actions: "#backToFactors",
        },
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
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
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.user.email,
          } as any;
          return {
            method: "verifyCode",
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

const passwordConfig: SignupMachineConfig = {
  id: "password",
  initial: "showForm",
  states: {
    showForm: {
      on: {
        submit: [
          {
            actions: "setPassword",
            target: "send",
            cond: "passwordsMatch",
          },
          {
            actions: "setErrorMessageForPasswordMismatch",
            target: "showForm",
          },
        ],
        back: {
          actions: "#backToFactors",
        },
      },
    },
    send: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
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
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showPasswordSet",
          },
        ],
        onError: {
          actions: "setErrorFromApiError",
          target: "showForm",
        },
      },
    },
    showPasswordSet: {
      type: "final",
    },
  },
};

const setUpTotpConfig: SignupMachineConfig = {
  id: "setUpTotp",
  initial: "getQrCode",
  states: {
    getQrCode: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getTotpAuthenticatorQrCode",
          args: {},
        }),
        onDone: {
          actions: "setQrCode",
          target: "showQrCode",
        },
        onError: {
          actions: "setErrorFromApiError",
          target: "showErrorMessage",
        },
      },
    },
    showQrCode: {
      on: {
        submit: {
          actions: "setTotpCode",
          target: "confirmTotpCode",
        },
        back: {
          actions: "#backToFactors",
        },
      },
    },
    confirmTotpCode: {
      entry: "clearError",
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "confirmTotpAuthenticatorCode",
          args: {
            totpCode: event.totpCode,
          },
        }),
        onDone: "showBackupCodes",
        onError: {
          actions: "setErrorFromApiError",
          target: "showQrCode",
        },
      },
    },
    showBackupCodes: {
      on: {
        finish: [
          {
            actions: "setAllowedSecondFactors",
            target: "#beginSecondFactor",
            cond: "secondFactorRequired",
          },
          {
            actions: "redirectIfSignedIn",
            target: "showTotpSetupComplete",
          },
        ],
      },
    },
    showErrorMessage: {
      on: {
        retry: "getQrCode",
        back: {
          actions: "backToFactors",
        },
      },
    },
    showTotpSetupComplete: {
      type: "final",
    },
  },
};

export const defaultSignupOptions = {
  guards: {
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
    hasOnlySsoFirstFactor: (context: SignupContext<any>) => {
      const factor = context.config.flow?.firstFactors[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },
    // isMfaRequired: (context: SignupContext<any>, event: SelectFactorEvent) => {
    //   return !!(context.config.flow?.isMfaRequired && !event.isSecondFactor);
    // },
    isEmailLink: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, Factors.EmailLink);
    },
    isEmailCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, Factors.EmailCode);
    },
    isSmsCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, Factors.SmsCode);
    },
    isPassword: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, Factors.Password);
    },
    isTotp: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, Factors.Totp);
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
    backToFactors,
  },
};

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
};

const missingFlowError = (message: string) => ({
  statusCode: 0,
  message,
  error: {
    type: "missing_flow_error",
  },
});

const signupMachineConfig: SignupMachineConfig = {
  schema: {
    context: {} as SignupContext<View>,
    events: {} as SignupMachineEvent,
  },
  id: "signup",
  initial: "init",
  states: {
    back: {
      id: "backToFactors",
      type: "history",
    },
    init: {
      always: [
        {
          target: "getGlobalTenantId",
          cond: "isMissingTenantId",
        },
        {
          target: "initFlow",
        },
      ],
    },
    getGlobalTenantId: {
      invoke: {
        src: callUserfrontApi,
        onDone: {
          target: "initFlow",
          actions: "setTenantIdOrDevMode",
        },
        onError: {
          target: "initFlow",
        },
      },
    },
    initFlow: {
      always: [
        {
          target: "missingFlowInDevModeError",
          cond: "isDevModeWithoutFlow",
        },
        {
          target: "missingFlowInLocalModeError",
          cond: "isLocalModeWithoutFlow",
        },
        {
          target: "showPlaceholderAndFetchFlow",
          cond: "isMissingFlow",
        },
        {
          target: "beginFlow",
          cond: "isLocalMode",
        },
        {
          target: "showPreviewAndFetchFlow",
        },
      ],
    },
    missingFlowInDevModeError: {
      entry: assign({ error: missingFlowError("Missing flow in dev mode") }),
    },
    missingFlowInLocalModeError: {
      entry: assign({ error: missingFlowError("Missing flow in local mode") }),
    },
    missingFlowFromServerError: {
      entry: assign({ error: missingFlowError("Missing flow from server") }),
    },
    showPlaceholderAndFetchFlow: {
      invoke: {
        src: callUserfrontApi,
        onDone: [
          {
            target: "beginFlow",
            actions: "setFlowFromUserfrontApi",
          },
        ],
        onError: [
          {
            target: "missingFlowFromServerError",
          },
        ],
      },
    },
    showPreviewAndFetchFlow: {
      invoke: {
        src: callUserfrontApi,
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
        onError: [
          {
            target: "missingFlowFromServerError",
          },
        ],
      },
      on: {
        selectFactor: {
          actions: "setActiveFactor",
        },
      },
    },
    beginFlow: {
      always: [
        {
          target: "selectFirstFactor",
          cond: "hasMultipleFirstFactors",
        },
        {
          target: "emailLink",
          cond: "hasOnlyEmailLinkFirstFactor",
        },
        {
          target: "emailCode",
          cond: "hasOnlyEmailCodeFirstFactor",
        },
        {
          target: "smsCode",
          cond: "hasOnlySmsCodeFirstFactor",
        },
        {
          target: "password",
          cond: "hasOnlyPasswordFirstFactor",
        },
        {
          target: "selectFirstFactor",
          cond: "hasOnlySsoFirstFactor",
        },
      ],
    },
    selectFirstFactor: {
      on: {
        selectFactor: [
          {
            target: "emailLink",
            cond: "isEmailLink",
          },
          {
            target: "emailCode",
            cond: "isEmailCode",
          },
          {
            target: "smsCode",
            cond: "isSmsCode",
          },
          {
            target: "password",
            cond: "isPassword",
          },
          {
            target: "ssoProvider",
            cond: "isSsoProvider",
          },
          {
            target: "ssoProvider",
            cond: "New Guard",
          },
        ],
      },
    },
    emailLink: emailLinkConfig,
    emailCode: emailCodeConfig,
    smsCode: smsCodeConfig,
    password: passwordConfig,
    ssoProvider: {
      type: "final",
    },
    beginSecondFactor: {
      id: "beginSecondFactor",
      always: [
        {
          target: "smsCode",
          cond: "hasOnlySmsCodeSecondFactor",
        },
        {
          target: "setUpTotp",
          cond: "hasOnlyTotpSecondFactor",
        },
        {
          target: "selectSecondFactor",
        },
      ],
    },
    selectSecondFactor: {
      on: {
        selectFactor: [
          {
            target: "smsCodeSecondFactor",
            cond: "isSmsCode",
          },
          {
            target: "setUpTotp",
            cond: "isTotp",
          },
        ],
      },
    },
    smsCodeSecondFactor: smsCodeConfig,
    setUpTotp: setUpTotpConfig,
    finish: {
      type: "final",
    },
  },
};

const createSignupMachine = (
  initialContext: SignupContext<any>,
  options: any = {}
) => {
  const machine = createMachine(signupMachineConfig, {
    ...defaultSignupOptions,
    ...options,
  }).withContext({
    ...defaultSignupContext,
    ...initialContext,
  });
  return machine;
};

export default createSignupMachine;
