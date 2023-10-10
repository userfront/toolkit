import { MachineConfig } from "xstate";
export type Factor = {
  channel: string;
  strategy: string;
  isConfiguredByUser?: boolean;
};
export type Flow = {
  firstFactors: Factor[];
};
export type FormError = {
  statusCode?: number | string;
  message: string;
  error: {
    type: string;
  };
};
export type FormType = "signup" | "login" | "reset";
export type SignOnFormType = "signup" | "login";
export type FactorAction = "setup" | "use";
export interface FormConfig {
  type: FormType;
  tenantId?: string;
  flow?: Flow;
  mode?: string;
  compact: boolean;
  locale: string;
  shouldFetchFlow: boolean;
  redirect?: string | boolean;
  redirectOnLoad?: boolean;
}
export interface UserData {
  email: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
  emailOrUsername?: string;
}
export interface CommonFormData {}
export interface EmailLink extends CommonFormData {
  type: "emailLink";
  message: string;
}
export interface EmailCode extends CommonFormData {
  type: "emailCode";
  verificationCode: string;
}
export interface SmsCode extends CommonFormData {
  type: "smsCode";
  phoneNumber: string;
  verificationCode: string;
}
export interface Password extends CommonFormData {
  type: "password";
  password: string;
}
export interface TotpCode extends CommonFormData {
  type: "totp";
  showEmailOrUsername: boolean;
  emailOrUsername?: string;
  totpCode: string;
  backupCode?: string;
  useBackupCode?: boolean;
  qrCode?: string;
  backupCodes?: string[];
  allowedSecondFactors?: Factor[];
  isMfaRequired?: boolean;
}
export interface ResetPassword extends CommonFormData {
  type: "resetPassword";
}
export interface FirstFactors extends Password {
  compact: boolean;
}
export interface SecondFactors extends Password {
  compact: boolean;
}
export interface Message extends CommonFormData {
  type: "message";
  message: string;
}
export interface Loading extends CommonFormData {
  type: "loading";
}
export interface RequestPasswordReset extends CommonFormData {
  type: "requestPasswordReset";
  message: string;
}
export interface SetNewPassword extends CommonFormData {
  type: "password";
  password: string;
  existingPassword?: string;
}
export type View =
  | EmailLink
  | EmailCode
  | SmsCode
  | Password
  | TotpCode
  | ResetPassword
  | FirstFactors
  | SecondFactors
  | Message
  | Loading;
export type Query = {
  token?: string;
  uuid?: string;
  isValid?: boolean;
};
export interface AuthContext<ViewType> {
  user: UserData;
  config: FormConfig;
  view: ViewType;
  action: FactorAction;
  isSecondFactor: boolean;
  activeFactor?: Factor;
  allowedSecondFactors?: Factor[];
  allowBack: boolean;
  query: Query;
  error?: FormError;
}
export type AnyAuthContext = AuthContext<CommonFormData>;
export type EmailLinkContext = AuthContext<EmailLink>;
export type EmailCodeContext = AuthContext<EmailCode>;
export type SmsCodeContext = AuthContext<SmsCode>;
export type PasswordContext = AuthContext<Password>;
export type TotpCodeContext = AuthContext<TotpCode>;
export type FirstFactorsContext = AuthContext<FirstFactors>;
export type SecondFactorsContext = AuthContext<SecondFactors>;
export type LoadingContext = AuthContext<Loading>;
export type SetNewPasswordContext = AuthContext<SetNewPassword>;
export type BackEvent = {
  type: "back";
};
export type FinishEvent = {
  type: "finish";
};
export type ResendEvent = {
  type: "resend";
};
export type RetryEvent = {
  type: "retry";
};
export type UserfrontApiDoneEvent = {
  type: "done";
  data: Object;
};
export type UserfrontApiFetchQrCodeEvent = {
  type: "done";
  data: {
    qrCode: string;
    backupCodes: string[];
  };
};
export type UserfrontApiGetTenantIdEvent = {
  type: "done";
  data: {
    tenantId?: string;
  };
};
export type UserfrontApiFetchFlowEvent = {
  type: "done";
  data: {
    authentication: Flow;
    mode: "live" | "test";
  };
};
export type UserfrontApiFactorResponseEvent = {
  type: "done";
  data: {
    isMfaRequired: boolean;
    authentication: {
      firstFactor: Factor;
      secondFactors: Factor[];
    };
  };
};
export type UserfrontApiErrorEvent = {
  type: "error";
  data: {
    error: FormError;
  };
};
export type EmailSubmitEvent = {
  type: "submit";
  email: string;
  name?: string;
  username?: string;
};
export type CodeSubmitEvent = {
  type: "submit";
  verificationCode: string;
};
export type PasswordSubmitEvent = {
  type: "submit";
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  username?: string;
  emailOrUsername?: string;
};
export type PhoneNumberSubmitEvent = {
  type: "submit";
  phoneNumber: string;
};
export type TotpCodeSubmitEvent = {
  type: "submit";
  totpCode?: string;
  backupCode?: string;
  emailOrUsername?: string;
};
export type UseBackupCodeEvent = {
  type: "useBackupCode";
  useBackupCode: boolean;
};
export type SelectFactorEvent = {
  type: "selectFactor";
  factor: Factor;
  isSecondFactor: boolean;
};
export type SetNewPasswordSubmitEvent = {
  type: "setNewPassword";
  password: string;
  confirmPassword: string;
  existingPassword?: string;
};
export type AuthMachineEvent =
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
  | UseBackupCodeEvent
  | SelectFactorEvent
  | SetNewPasswordSubmitEvent;
export type AuthMachineConfig = MachineConfig<
  AuthContext<View>,
  any,
  AuthMachineEvent
>;
