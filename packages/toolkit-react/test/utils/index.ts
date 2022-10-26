import {
  SignupContext,
  EmailLinkContext,
  EmailCodeContext,
  SmsCodeContext,
  PasswordContext,
  SetUpTotpContext,
  FirstFactorsContext,
  SecondFactorsContext,
  LoadingContext,
  UserData,
  FormConfig,
  Factor,
  FormError,
  OptionalFieldConfig,
  FormType,
} from "../../src/models/types";

import { signupFactors } from "../../src/models/utils";

export const createSignupContextForFactor = (
  name: string
): SignupContext<any> => {
  const key = name as keyof typeof signupFactors;
  const view = signupFactors[key]?.viewContext ?? {};
  const context = {
    user: {
      email: "test@email.com",
    },
    config: {
      type: "signup" as FormType,
      nameConfig: "hide" as OptionalFieldConfig,
      usernameConfig: "hide" as OptionalFieldConfig,
      phoneNumberConfig: "hide" as OptionalFieldConfig,
      compact: false,
      locale: "en-US",
      devMode: false,
      shouldFetchFlow: true,
    },
    view,
    isSecondFactor: false,
    allowBack: false,
  };
  return context;
};
