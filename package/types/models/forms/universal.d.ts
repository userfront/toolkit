import {
  AuthContext,
  SelectFactorEvent,
  Loading,
  View,
  AuthMachineEvent,
} from "../types";
export declare const defaultOptions: {
  guards: {
    hasMultipleFirstFactors: (context: AuthContext<any>, event: any) => boolean;
    hasOnlyEmailLinkFirstFactor: (context: any) => boolean;
    hasOnlyEmailCodeFirstFactor: (context: any) => boolean;
    hasOnlySmsCodeFirstFactor: (context: any) => boolean;
    hasOnlyPasswordFirstFactor: (context: any) => boolean;
    hasOnlyTotpFirstFactor: (context: any) => boolean;
    hasOnlySsoFirstFactor: (context: AuthContext<any>) => boolean;
    hasMultipleSecondFactors: (
      context: AuthContext<any>,
      event: any
    ) => boolean;
    hasOnlyEmailLinkSecondFactor: (context: any) => boolean;
    hasOnlyEmailCodeSecondFactor: (context: any) => boolean;
    hasOnlySmsCodeSecondFactor: (context: any) => boolean;
    hasOnlyPasswordSecondFactor: (context: any) => boolean;
    hasOnlyTotpSecondFactor: (context: any) => boolean;
    hasOnlySsoSecondFactor: (context: AuthContext<any>) => boolean;
    isEmailLink: (_1: any, event: SelectFactorEvent) => boolean;
    isEmailCode: (_1: any, event: SelectFactorEvent) => boolean;
    isSmsCode: (_1: any, event: SelectFactorEvent) => boolean;
    isPassword: (_1: any, event: SelectFactorEvent) => boolean;
    isTotp: (_1: any, event: SelectFactorEvent) => boolean;
    isSsoProvider: (_1: any, event: SelectFactorEvent) => boolean;
    hasNoActiveFactor: (context: AuthContext<any>) => boolean;
    isLocalMode: (context: AuthContext<any>) => boolean;
    isMissingFlow: (context: AuthContext<any>) => boolean;
    isMissingFlowFromServer: (
      context: AuthContext<any>,
      event: import("../types").UserfrontApiFetchFlowEvent
    ) => boolean;
    isLocalModeWithoutFlow: (context: AuthContext<any>) => boolean;
    isMissingTenantId: (context: AuthContext<any>) => boolean;
    passwordsMatch: (
      context: AuthContext<import("../types").Password>,
      event: import("../types").PasswordSubmitEvent
    ) => boolean;
    hasLinkQueryParams: (context: AuthContext<any>) => boolean;
    secondFactorRequired: (
      context: AuthContext<any>,
      event: import("../types").UserfrontApiFactorResponseEvent
    ) => boolean;
    secondFactorRequiredFromView: (
      context: import("../types").TotpCodeContext
    ) => boolean;
    isLoggedIn: () => boolean;
    isSecondFactor: (context: AuthContext<View>) => boolean;
    isPasswordReset: (context: AuthContext<any>) => boolean;
    isLoggedInOrHasLinkCredentials: (context: AuthContext<any>) => boolean;
    isSetup: (context: AuthContext<any>) => boolean;
  };
  actions: {
    setActiveFactor: import("xstate").AssignAction<
      AuthContext<any>,
      SelectFactorEvent
    >;
    resumeIfNeeded: import("xstate").ChooseAction<
      AuthContext<any>,
      import("xstate").EventObject
    >;
    setFlowFromUserfrontApi: import("xstate").AssignAction<
      AuthContext<any>,
      import("../types").UserfrontApiFetchFlowEvent
    >;
    setEmail: import("xstate").AssignAction<
      unknown,
      import("../types").EmailSubmitEvent
    >;
    setPassword: import("xstate").AssignAction<
      import("../types").PasswordContext,
      import("../types").PasswordSubmitEvent
    >;
    setPhoneNumber: import("xstate").AssignAction<
      import("../types").SmsCodeContext,
      import("../types").PhoneNumberSubmitEvent
    >;
    setTenantIdIfPresent: import("xstate").AssignAction<
      AuthContext<any>,
      import("../types").UserfrontApiGetTenantIdEvent
    >;
    setTotpCode: import("xstate").AssignAction<
      import("../types").TotpCodeContext,
      import("../types").TotpCodeSubmitEvent
    >;
    setUseBackupCode: import("xstate").AssignAction<
      import("../types").TotpCodeContext,
      import("../types").UseBackupCodeEvent
    >;
    setQrCode: import("xstate").AssignAction<
      import("../types").TotpCodeContext,
      import("../types").UserfrontApiFetchQrCodeEvent
    >;
    redirectIfLoggedIn: (context: AuthContext<any>) => void;
    redirectOnLoad: (context: AuthContext<any>) => void;
    setCode: import("xstate").AssignAction<
      Pick<
        import("../types").EmailCodeContext | import("../types").SmsCodeContext,
        "view"
      >,
      import("../types").CodeSubmitEvent
    >;
    setErrorFromApiError: import("xstate").AssignAction<
      unknown,
      import("../types").UserfrontApiErrorEvent
    >;
    clearError: import("xstate").AssignAction<
      {
        error: undefined;
      },
      import("xstate").EventObject
    >;
    setErrorForPasswordMismatch: import("xstate").AssignAction<
      {
        error: {
          statusCode: number;
          message: string;
          error: {
            type: string;
          };
        };
      },
      import("xstate").EventObject
    >;
    setShowEmailOrUsernameIfFirstFactor: (
      context: import("../types").TotpCodeContext
    ) => import("xstate").AssignAction<
      {
        view: {
          showEmailOrUsername: boolean;
          type: "totp";
          emailOrUsername?: string;
          totpCode: string;
          backupCode?: string;
          useBackupCode?: boolean;
          qrCode?: string;
          backupCodes?: string[];
          allowedSecondFactors?: import("../types").Factor[];
          isMfaRequired?: boolean;
        };
      },
      import("xstate").EventObject
    >;
    markAsSecondFactor: import("xstate").AssignAction<
      {
        isSecondFactor: boolean;
      },
      import("xstate").EventObject
    >;
    setAllowedSecondFactors: import("xstate").AssignAction<
      AuthContext<any>,
      import("../types").UserfrontApiFactorResponseEvent
    >;
    setAllowedSecondFactorsFromView: import("xstate").AssignAction<
      import("../types").TotpCodeContext,
      import("xstate").EventObject
    >;
    storeFactorResponse: import("xstate").AssignAction<
      import("../types").TotpCodeContext,
      import("../types").UserfrontApiFactorResponseEvent
    >;
    disableBack: import("xstate").AssignAction<
      {
        allowBack: boolean;
      },
      import("xstate").EventObject
    >;
    enableBack: import("xstate").AssignAction<
      {
        allowBack: boolean;
      },
      import("xstate").EventObject
    >;
    setupView: (
      context: AuthContext<View>,
      event: SelectFactorEvent
    ) => import("xstate").AssignAction<
      {
        view:
          | {
              type: string;
              message: string;
            }
          | {
              type: string;
              code: string;
            }
          | {
              type: string;
              phoneNumber: string;
              code: string;
            }
          | {
              type: string;
              password: string;
            }
          | {
              type: string;
              totpCode: string;
              showEmailOrUsername: boolean;
              useBackupCode: boolean;
              backupCode: string;
              qrCode: string;
              backupCodes: any[];
              isMfaRequired: boolean;
              allowedSecondFactors: any[];
            }
          | {};
      },
      import("xstate").EventObject
    >;
    readQueryParams: import("xstate").AssignAction<
      AuthContext<View>,
      import("xstate").EventObject
    >;
    markQueryParamsInvalid: import("xstate").AssignAction<
      {
        query: {
          isValid: boolean;
        };
      },
      import("xstate").EventObject
    >;
    setResentMessage: import("xstate").AssignAction<
      import("../types").EmailLinkContext,
      import("xstate").EventObject
    >;
    clearResentMessage: import("xstate").AssignAction<
      import("../types").EmailLinkContext,
      import("xstate").EventObject
    >;
    setFirstFactorAction: import("xstate").AssignAction<
      AuthContext<View>,
      import("xstate").EventObject
    >;
    setSecondFactorAction: import("xstate").AssignAction<
      AuthContext<View>,
      import("xstate").EventObject
    >;
    setPasswordForReset: import("xstate").AssignAction<
      import("../types").SetNewPasswordContext,
      import("../types").SetNewPasswordSubmitEvent
    >;
  };
};
export declare const defaultAuthContext: {
  user: {
    email: string;
  };
  config: {
    flow: any;
    tenantId: any;
    shouldFetchFlow: boolean;
    mode: string;
    compact: boolean;
    locale: string;
    type: string;
    action: string;
  };
  view: Loading;
  isSecondFactor: boolean;
};
declare const createUniversalMachine: (
  initialContext: AuthContext<View>,
  options?: any
) => import("xstate").StateMachine<
  AuthContext<View>,
  any,
  AuthMachineEvent,
  {
    value: any;
    context: AuthContext<View>;
  },
  import("xstate").BaseActionObject,
  import("xstate").ServiceMap,
  import("xstate").ResolveTypegenMeta<
    import("xstate").TypegenDisabled,
    AuthMachineEvent,
    import("xstate").BaseActionObject,
    import("xstate").ServiceMap
  >
>;
export default createUniversalMachine;
