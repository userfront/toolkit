import {
  UserfrontApiErrorEvent,
  AuthContext,
  View,
  SelectFactorEvent,
  EmailSubmitEvent,
  EmailCodeContext,
  SmsCodeContext,
  CodeSubmitEvent,
  PasswordContext,
  PasswordSubmitEvent,
  PhoneNumberSubmitEvent,
  TotpCodeContext,
  UserfrontApiFetchQrCodeEvent,
  TotpCodeSubmitEvent,
  UserfrontApiFactorResponseEvent,
  UserfrontApiGetTenantIdEvent,
  UserfrontApiFetchFlowEvent,
  UseBackupCodeEvent,
  Factor,
  EmailLinkContext,
  SetNewPasswordContext,
  SetNewPasswordSubmitEvent,
} from "../types";
export declare const clearError: import("xstate").AssignAction<
  {
    error: undefined;
  },
  import("xstate").EventObject
>;
export declare const setErrorFromApiError: import("xstate").AssignAction<
  unknown,
  UserfrontApiErrorEvent
>;
export declare const setErrorForPasswordMismatch: import("xstate").AssignAction<
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
export declare const disableBack: import("xstate").AssignAction<
  {
    allowBack: boolean;
  },
  import("xstate").EventObject
>;
export declare const enableBack: import("xstate").AssignAction<
  {
    allowBack: boolean;
  },
  import("xstate").EventObject
>;
export declare const readQueryParams: import("xstate").AssignAction<
  AuthContext<View>,
  import("xstate").EventObject
>;
export declare const markQueryParamsInvalid: import("xstate").AssignAction<
  {
    query: {
      isValid: boolean;
    };
  },
  import("xstate").EventObject
>;
export declare const setupView: (
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
export declare const setEmail: import("xstate").AssignAction<
  unknown,
  EmailSubmitEvent
>;
export declare const setCode: import("xstate").AssignAction<
  Pick<EmailCodeContext | SmsCodeContext, "view">,
  CodeSubmitEvent
>;
export declare const setPassword: import("xstate").AssignAction<
  PasswordContext,
  PasswordSubmitEvent
>;
export declare const setPasswordForReset: import("xstate").AssignAction<
  SetNewPasswordContext,
  SetNewPasswordSubmitEvent
>;
export declare const setPhoneNumber: import("xstate").AssignAction<
  SmsCodeContext,
  PhoneNumberSubmitEvent
>;
export declare const setQrCode: import("xstate").AssignAction<
  TotpCodeContext,
  UserfrontApiFetchQrCodeEvent
>;
export declare const setTotpCode: import("xstate").AssignAction<
  TotpCodeContext,
  TotpCodeSubmitEvent
>;
export declare const setUseBackupCode: import("xstate").AssignAction<
  TotpCodeContext,
  UseBackupCodeEvent
>;
export declare const setShowEmailOrUsernameIfFirstFactor: (
  context: TotpCodeContext
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
      allowedSecondFactors?: Factor[];
      isMfaRequired?: boolean;
    };
  },
  import("xstate").EventObject
>;
export declare const storeFactorResponse: import("xstate").AssignAction<
  TotpCodeContext,
  UserfrontApiFactorResponseEvent
>;
export declare const setAllowedSecondFactors: import("xstate").AssignAction<
  AuthContext<any>,
  UserfrontApiFactorResponseEvent
>;
export declare const setAllowedSecondFactorsFromView: import("xstate").AssignAction<
  TotpCodeContext,
  import("xstate").EventObject
>;
export declare const markAsSecondFactor: import("xstate").AssignAction<
  {
    isSecondFactor: boolean;
  },
  import("xstate").EventObject
>;
export declare const redirectIfLoggedIn: (context: AuthContext<any>) => void;
export declare const redirectOnLoad: (context: AuthContext<any>) => void;
export declare const setTenantIdIfPresent: import("xstate").AssignAction<
  AuthContext<any>,
  UserfrontApiGetTenantIdEvent
>;
export declare const setFlowFromUserfrontApi: import("xstate").AssignAction<
  AuthContext<any>,
  UserfrontApiFetchFlowEvent
>;
export declare const resumeIfNeeded: import("xstate").ChooseAction<
  AuthContext<any>,
  import("xstate").EventObject
>;
export declare const setActiveFactor: import("xstate").AssignAction<
  AuthContext<any>,
  SelectFactorEvent
>;
export declare const setResentMessage: import("xstate").AssignAction<
  EmailLinkContext,
  import("xstate").EventObject
>;
export declare const clearResentMessage: import("xstate").AssignAction<
  EmailLinkContext,
  import("xstate").EventObject
>;
export declare const setFirstFactorAction: import("xstate").AssignAction<
  AuthContext<View>,
  import("xstate").EventObject
>;
export declare const setSecondFactorAction: import("xstate").AssignAction<
  AuthContext<View>,
  import("xstate").EventObject
>;
