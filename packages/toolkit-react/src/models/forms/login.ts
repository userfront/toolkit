import { createMachine, assign } from "xstate";
import {
  setActiveFactor,
  resumeIfNeeded,
  setFlowFromUserfrontApi,
  setEmail,
  setPassword,
  setPhoneNumber,
  setTenantIdIfPresent,
  setTotpCode,
  setUseBackupCode,
  setShowEmailOrUsernameIfFirstFactor,
  redirectIfLoggedIn,
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
  readQueryParams,
  markQueryParamsInvalid,
  setResentMessage,
  clearResentMessage,
} from "../config/actions";
import emailCodeConfig from "../views/emailCode";
import emailLinkConfig from "../views/emailLink";
import {
  isSsoProvider,
  hasNoActiveFactor,
  isLocalMode,
  isMissingFlow,
  isLocalModeWithoutFlow,
  isMissingTenantId,
  hasLinkQueryParams,
  secondFactorRequired,
  secondFactorRequiredFromView,
  isLoggedIn,
  isSecondFactor,
  alwaysSucceed,
} from "../config/guards";
import passwordConfig from "../views/password";
import selectFactorConfig from "../views/selectFactor";
import totpCodeConfig from "../views/totpCode";
import smsCodeConfig from "../views/smsCode";
import {
  AuthContext,
  SelectFactorEvent,
  Loading,
  AuthMachineConfig,
  View,
  SignupMachineEvent,
} from "../types";
import { callUserfront, getUserfrontProperty } from "../../services/userfront";
import {
  createOnlyFactorCondition,
  matchFactor,
  factorConfig,
  missingFlowError,
  unhandledError,
} from "../config/utils";

// SIGNUP FORM MACHINE CONFIG

// Options: provide the guards and actions for the state machine as
// a separate object, so we can override them as needed for testing.
export const defaultSignupOptions = {
  guards: {
    // Predicates for first factors:
    // Does the flow have multiple first factors?
    hasMultipleFirstFactors: (context: AuthContext<any>, event: any) => {
      return (context.config.flow?.firstFactors?.length ?? 0) > 1;
    },
    // Is the flow only one factor? One predicate per factor type.
    // If there's only one allowed factor, allows us to skip the select screen
    // and proceed directly to that factor.
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
    hasOnlySsoFirstFactor: (context: AuthContext<any>) => {
      const factor = context.config.flow?.firstFactors[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for second factors
    // Identical to the first factor predicates
    hasMultipleSecondFactors: (context: AuthContext<any>, event: any) => {
      return (context.allowedSecondFactors?.length ?? 0) > 1;
    },
    // Is the flow only one factor? One predicate per factor type.
    // If there's only one allowed factor, allows us to skip the select screen
    // and proceed directly to that factor.
    hasOnlyEmailLinkSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "link",
      secondFactor: true,
    }),
    hasOnlyEmailCodeSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "verificationCode",
      secondFactor: true,
    }),
    hasOnlySmsCodeSecondFactor: createOnlyFactorCondition({
      channel: "sms",
      strategy: "verificationCode",
      secondFactor: true,
    }),
    hasOnlyPasswordSecondFactor: createOnlyFactorCondition({
      channel: "email",
      strategy: "password",
      secondFactor: true,
    }),
    hasOnlyTotpSecondFactor: createOnlyFactorCondition({
      channel: "authenticator",
      strategy: "totp",
      secondFactor: true,
    }),
    hasOnlySsoSecondFactor: (context: AuthContext<any>) => {
      const factor = context.allowedSecondFactors?.[0];
      if (!factor) {
        return false;
      }
      return isSsoProvider(factor);
    },

    // Predicates for matching factors
    isEmailLink: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.emailLink);
    },
    isEmailCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.emailCode);
    },
    isSmsCode: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.smsCode);
    },
    isPassword: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.password);
    },
    isTotp: (_1: any, event: SelectFactorEvent) => {
      return matchFactor(event.factor, factorConfig.totp);
    },
    isSsoProvider: (_1: any, event: SelectFactorEvent) => {
      return isSsoProvider(event.factor);
    },

    hasNoActiveFactor,
    isLocalMode,
    isMissingFlow,
    isLocalModeWithoutFlow,
    isMissingTenantId,
    passwordsMatch: alwaysSucceed,
    hasLinkQueryParams,
    secondFactorRequired,
    secondFactorRequiredFromView,
    isLoggedIn,
    isSecondFactor,
  },
  actions: {
    setActiveFactor,
    resumeIfNeeded,
    setFlowFromUserfrontApi,
    setEmail,
    setPassword,
    setPhoneNumber,
    setTenantIdIfPresent,
    setTotpCode,
    setUseBackupCode,
    setShowEmailOrUsernameIfFirstFactor,
    redirectIfLoggedIn,
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
    readQueryParams,
    markQueryParamsInvalid,
    setResentMessage,
    clearResentMessage,
  },
};

// A default/starting context for the signup machine
export const defaultAuthContext = {
  user: {
    email: "",
  },
  config: {
    flow: null,
    tenantId: null,
    shouldFetchFlow: true,
    mode: "live",
    compact: false,
    locale: "en-US",
    type: "login",
  },
  view: {} as Loading,
  isSecondFactor: false,
  allowBack: true,
  error: null,
  query: {
    token: "",
    uuid: "",
  },
};

// Signup machine top-level configuration
const signupMachineConfig: AuthMachineConfig = {
  // Enables TypeScript typings
  schema: {
    context: {} as AuthContext<View>,
    events: {} as SignupMachineEvent,
  },
  id: "signup",
  predictableActionArguments: true,
  initial: "init",
  states: {
    // Go back to the previous factor selection screen.
    backToFactors: {
      id: "backToFactors",
      always: [
        {
          target: "selectSecondFactor",
          cond: "isSecondFactor",
        },
        {
          target: "selectFirstFactor",
        },
      ],
    },
    // Initial state
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
    getGlobalTenantId: {
      invoke: {
        // @ts-ignore
        src: () => getUserfrontProperty("store.tenantId"),
        // Set the tenant ID if one was present, otherwise set isDevMode = true.
        // Then proceed to start the flow.
        onDone: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
        onError: [
          {
            target: "initFlow",
            actions: "setTenantIdIfPresent",
          },
        ],
      },
    },
    // Start the flow, if possible, or report an error.
    initFlow: {
      // If there are uuid and token query params, add them to the context
      entry: ["readQueryParams"],
      always: [
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
        {
          target: "showPreviewAndFetchFlow",
        },
      ],
    },
    // Report the errors above
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
        // Will retrieve mode & flow after userfront-core update
        // @ts-ignore - TS doesn't infer all of the valid methods correctly
        src: () => callUserfront({ method: "setMode" }),
        // On failure, report an error.
        onError: {
          target: "missingFlowFromServerError",
        },
        // On success, proceed to the first step
        onDone: [
          {
            target: "beginFlow",
            actions: "setFlowFromUserfrontApi",
          },
        ],
      },
    },
    // Show a partially functional preview based on the locally provided flow
    // while fetching the updated flow from Userfront servers
    showPreviewAndFetchFlow: {
      invoke: {
        // Will retrieve mode & flow after userfront-core update
        // @ts-ignore
        src: () => callUserfront({ method: "setMode" }),
        // Report errors.
        onError: {
          target: "missingFlowFromServerError",
        },
        // On success, if the user hasn't selected a factor, then proceed as normal.
        // If the user has selected a factor, proceed directly to that factor's view.
        onDone: [
          {
            target: "beginFlow",
            cond: "hasNoActiveFactor",
            actions: "setFlowFromUserfrontApi",
          },
          {
            actions: ["setFlowFromUserfrontApi", "resumeIfNeeded"],
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
      // At this point the Userfront singleton is fully initialized, so we should
      // try to redirect if the user is logged in and config.redirect !== false.
      entry: ["redirectIfLoggedIn", "setupView"],
      always: [
        // If we're returning from a passwordless/email link or SSO first factor, attempt to use
        // the query params to proceed.
        {
          target: "handleLoginWithLink",
          cond: "hasLinkQueryParams",
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
        ...Object.values(factorConfig).map((factor) => ({
          actions: "disableBack",
          target: factor.name,
          cond: factor.testOnlyFirst,
        })),
        // NOTE: this should be exhaustive; if we fall through to here without finding a next step,
        // that means that the only first factor in the flow is one we don't recognize.

        // Duplicates, should never be reached.
        // Only here to help out the XState visualizer.
        // Uncomment if using the visualizer.

        // {
        //   actions: "disableBack",
        //   target: "emailLink",
        //   cond: "hasOnlyEmailLinkFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "emailCode",
        //   cond: "hasOnlyEmailCodeFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "smsCode",
        //   cond: "hasOnlySmsCodeFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "password",
        //   cond: "hasOnlyPasswordFirstFactor",
        // },
        // {
        //   actions: "disableBack",
        //   target: "totpCode",
        //   cond: "hasOnlyTotpFirstFactor",
        // },

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
    totpCode: totpCodeConfig,
    // Start an SSO provider login flow
    ssoProvider: {
      id: "ssoProvider",
      invoke: {
        src: (context: any, event: any) => {
          return callUserfront({
            method: "login",
            args: [
              {
                method: event.factor?.strategy,
              },
            ],
          });
        },
        // At this point we should have already redirected to the SSO provider.
        // If the API call returned an error, report it. Otherwise, not much we can do here.
        onError: {
          target: "unhandledError",
        },
      },
    },
    // Handle an incoming login link, using its query parameters to continue the login flow
    handleLoginWithLink: {
      id: "handleLoginWithLink",
      invoke: {
        src: (context) => {
          return callUserfront({
            method: "login",
            args: [
              {
                method: "link",
                token: context.query.token,
                uuid: context.query.uuid,
              },
            ],
          });
        },
        onDone: [
          // If we need to enter a second factor, proceed to that step
          {
            actions: "setAllowedSecondFactors",
            target: "beginSecondFactor",
            cond: "secondFactorRequired",
          },
          // Otherwise, we're logged in
          {
            target: "finish",
          },
        ],
        onError: [
          // If there was a problem logging in with the link token and uuid,
          // go back to first factor selection and show the error.
          // Mark the query params invalid, so we don't infinitely retry them.
          {
            actions: ["setErrorFromApiError", "markQueryParamsInvalid"],
            target: "beginFlow",
          },
        ],
      },
    },
    // Check to see if a second factor is needed, and if so, proceed to the appropriate view
    beginSecondFactor: {
      id: "beginSecondFactor",
      entry: "setupView",
      always: [
        // If a second factor isn't needed, finish the flow.
        {
          target: "finish",
          cond: "isLoggedIn",
        },
        // These are identical to the first factor cases:
        // If there's multiple possible second factors, proceed to factor selection
        {
          actions: ["enableBack", "markAsSecondFactor"],
          target: "selectSecondFactor",
          cond: "hasMultipleSecondFactors",
        },
        // If there's only SSO providers as second factors (?!?), proceed to factor selection
        {
          actions: "markAsSecondFactor",
          target: "selectSecondFactor",
          cond: "hasOnlySsoSecondFactor",
        },
        // Otherwise, if there's only one second factor, show that factor's view
        ...Object.values(factorConfig).map((factor) => ({
          actions: ["disableBack", "markAsSecondFactor"],
          target: factor.name,
          cond: factor.testOnlySecond,
        })),

        // Duplicates, should never be reached.
        // Only here to help out the XState visualizer.
        // Uncomment if using the visualizer.

        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "emailLink",
        //   cond: "hasOnlyEmailLinkSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "emailCode",
        //   cond: "hasOnlyEmailCodeSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "smsCode",
        //   cond: "hasOnlySmsCodeSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "password",
        //   cond: "hasOnlyPasswordSecondFactor",
        // },
        // {
        //   actions: ["disableBack", "markAsSecondFactor"],
        //   target: "totpCode",
        //   cond: "hasOnlyTotpSecondFactor",
        // },

        // If we get here, it's an unhandled error
        {
          target: "unhandledError",
        },
      ],
    },
    selectSecondFactor: selectFactorConfig,
    // Finish the flow.
    // Redirect, or show a confirmation view if config.redirect === false.
    finish: {
      id: "finish",
      entry: "redirectIfLoggedIn",
      type: "final",
    },
  },
};

// Create a state machine for the signup flow
const createSignupMachine = (
  initialContext: AuthContext<View>,
  options: any = {}
) => {
  const machine = createMachine(signupMachineConfig, {
    ...defaultSignupOptions,
    ...options,
  }).withContext(initialContext);
  return machine;
};

export default createSignupMachine;
