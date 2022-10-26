import { MachineConfig } from "xstate";
// TYPES

// A factor, per the Userfront API
export type Factor = {
  channel: string;
  strategy: string;
};

// An auth flow, per the Userfront API
export type Flow = {
  firstFactors: Factor[];
  secondFactors: Factor[];
  isMfaRequired: boolean;
};

// An error object as returned by the Userfront API
export type FormError = {
  statusCode?: number | string;
  message: string;
  error: {
    type: string;
  };
};

// Config for future optional fields on the form (name etc.)
export type OptionalFieldConfig = "hide" | "allow" | "require";

// Types of form in the toolkit
export type FormType =
  | "signup"
  | "login"
  | "requestPasswordResetEmail"
  | "resetPassword";

// Configuration data for the form - intended to be set either by the caller
// or during initial setup steps of the form, then fixed afterward.
export interface FormConfig {
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
export interface UserData {
  email: string;
  name?: string;
  username?: string;
  phoneNumber?: string;
}

// TYPES FOR FACTORS

// Data common to forms for all factors
export interface CommonFormData {}

export interface EmailLink extends CommonFormData {
  type: "emailLink";
}

export interface EmailCode extends CommonFormData {
  type: "emailCode";
  code: string;
}

export interface SmsCode extends CommonFormData {
  type: "smsCode";
  phoneNumber: string;
  code: string;
}

export interface Password extends CommonFormData {
  type: "password";
  password: string;
}

export interface SetUpTotp extends CommonFormData {
  type: "setUpTotp";
  qrCode: string;
  totpCode: string;
  totpBackupCodes: string[];
  isMfaRequired: boolean;
  allowedSecondFactors: Factor[];
}

export interface Totp extends CommonFormData {
  type: "totp";
  totpCode: string;
  backupCode: string;
  useBackupCode: boolean;
}

export interface ResetPassword extends CommonFormData {
  type: "resetPassword";
}

// Factor selection needs to extend Password because
// the Password view could be inlined
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

// A utility type that encompasses all factors.
export type View =
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
export interface SignupContext<ViewType> {
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
  allowBack: boolean;

  // Current error (if any)
  error?: FormError;
}

// Utility type aliases for each view's context
export type EmailLinkContext = SignupContext<EmailLink>;
export type EmailCodeContext = SignupContext<EmailCode>;
export type SmsCodeContext = SignupContext<SmsCode>;
export type PasswordContext = SignupContext<Password>;
export type SetUpTotpContext = SignupContext<SetUpTotp>;
export type FirstFactorsContext = SignupContext<FirstFactors>;
export type SecondFactorsContext = SignupContext<SecondFactors>;
export type LoadingContext = SignupContext<Loading>;

// EVENT TYPES

// GENERAL SHARED EVENTS

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

// USERFRONT API EVENTS
// TODO: it would be best to use types from @userfront/core here

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
  data: Flow;
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
  data: FormError;
};

// VIEW-SPECIFIC EVENTS

export type EmailSubmitEvent = {
  type: "submit";
  email: string;
  name?: string;
  username?: string;
};

export type CodeSubmitEvent = {
  type: "submit";
  code: string;
};

export type PasswordSubmitEvent = {
  type: "submit";
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  username?: string;
};

export type PhoneNumberSubmitEvent = {
  type: "submit";
  phoneNumber: string;
};

export type TotpCodeSubmitEvent = {
  type: "submit";
  totpCode: string;
};

export type SelectFactorEvent = {
  type: "selectFactor";
  factor: Factor;
  isSecondFactor: boolean;
};

// All events used in the signup machine
export type SignupMachineEvent =
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
export type SignupMachineConfig = MachineConfig<
  SignupContext<View>,
  any,
  SignupMachineEvent
>;
