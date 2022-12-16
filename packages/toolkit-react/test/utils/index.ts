import {
  AuthContext,
  OptionalFieldConfig,
  FormType,
} from "../../src/models/types";

import { factorConfig } from "../../src/models/config/utils";

export const createAuthContextForFactor = (name: string): AuthContext<any> => {
  const key = name as keyof typeof factorConfig;
  const view = factorConfig[key]?.viewContext ?? {};
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
