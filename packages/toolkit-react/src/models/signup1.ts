import { createMachine, assign, MachineConfig } from "xstate";

type SsoProvider =
  | "apple"
  | "azure"
  | "facebook"
  | "github"
  | "google"
  | "linkedin";
type Channel = "email" | "sms" | "authenticator";
type Strategy = "link" | "verificationCode" | "password" | "totp" | SsoProvider;

type Factor = {
  channel: Channel;
  strategy: Strategy;
};

type FactorList = Factor[];

type Flow = {
  firstFactors: FactorList;
  secondFactors: FactorList;
  isMfaRequired: boolean;
};

type Context = {
  flow: Flow;
  tenantId: string;
  compact?: boolean;
};

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

const signupMachineConfig: MachineConfig<Context, any, any> = {
  id: "signup",
  predictableActionArguments: true,
  initial: "init",
  context: {} as Context,
  states: {
    init: {
      always: [
        {
          target: "selectFirstFactor",
          cond: "hasMultipleFirstFactors",
        },
        {
          target: "enterEmailLink",
          cond: "hasOnlyEmailLinkFirstFactor",
        },
        {
          target: "enterEmailVerificationCode",
          cond: "hasOnlyEmailCodeFirstFactor",
        },
        {
          target: "enterPhoneVerificationCode",
          cond: "hasOnlySmsCodeFirstFactor",
        },
        {
          target: "signUpWithPassword",
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
        SELECT_EMAIL_LINK: {
          target: "enterEmailLink",
        },
        SELECT_EMAIL_CODE: {
          target: "enterEmailVerificationCode",
        },
        SELECT_SMS_CODE: {
          target: "enterPhoneVerificationCode",
        },
        SELECT_SSO_PROVIDER: {
          target: "useSsoProvider",
        },
        SELECT_PASSWORD: {
          target: "signUpWithPassword",
        },
        SUBMIT: {
          target: "validatePassword",
        },
      },
    },
    enterEmailLink: {
      on: {
        SUBMIT: {
          target: "sendingLinkByEmail",
        },
        BACK: {
          target: "previous",
        },
      },
    },
    sendingLinkByEmail: {
      on: {
        SUCCESS: {
          target: "linkSentByEmail",
        },
        FAILURE: {
          target: "enterEmailLink",
        },
      },
    },
    linkSentByEmail: {
      on: {
        RESEND: {
          target: "sendingLinkByEmail",
        },
        BACK: {
          target: "previous",
        },
      },
    },
    enterEmailVerificationCode: {
      on: {
        SUBMIT: {
          target: "sendingVerificationCodeByEmail",
        },
        BACK: {
          target: "previous",
        },
      },
    },
    sendingVerificationCodeByEmail: {
      on: {
        SUCCESS: {
          target: "verificationCodeSentByEmail",
        },
        FAILURE: {
          target: "enterEmailVerificationCode",
        },
      },
    },
    verificationCodeSentByEmail: {
      on: {
        SUBMIT: {
          target: "submittingEmailVerificationCode",
        },
        BACK: {
          target: "enterEmailVerificationCode",
        },
        RESEND: {
          target: "sendingVerificationCodeByEmail",
        },
      },
    },
    submittingEmailVerificationCode: {
      on: {
        SUCCESS: {
          target: "signUpSuccess",
        },
        FAILURE: {
          target: "verificationCodeSentByEmail",
        },
      },
    },
    enterPhoneVerificationCode: {
      on: {
        SUBMIT: {
          target: "sendingVerificationCodeBySms",
        },
        BACK: {
          target: "previous",
        },
      },
    },
    sendingVerificationCodeBySms: {
      on: {
        SUCCESS: {
          target: "verificationCodeSentBySms",
        },
        FAILURE: {
          target: "enterPhoneVerificationCode",
        },
      },
    },
    verificationCodeSentBySms: {
      on: {
        SUBMIT: {
          target: "submittingSmsVerificationCode",
        },
        BACK: {
          target: "enterPhoneVerificationCode",
        },
        RESEND: {
          target: "sendingVerificationCodeBySms",
        },
      },
    },
    submittingSmsVerificationCode: {
      on: {
        SUCCESS: {
          target: "signUpSuccess",
        },
        FAILURE: {
          target: "verificationCodeSentBySms",
        },
      },
    },
    useSsoProvider: {},
    signUpWithPassword: {
      on: {
        SUBMIT: {
          target: "validatePassword",
        },
        BACK: {
          target: "previous",
        },
      },
    },

    validatePassword: {
      on: {
        SUCCESS: {
          target: "submittingPassword",
        },
        FAILURE: {
          target: "signUpWithPassword",
        },
      },
    },
    submittingPassword: {
      on: {
        SUCCESS: {
          target: "signUpSuccess",
        },
        FAILURE: {
          target: "signUpWithPassword",
        },
      },
    },

    signUpSuccess: {
      always: [
        {
          target: "selectSecondFactor",
          cond: "isMfaRequired",
        },
      ],
    },
    selectSecondFactor: {
      on: {
        SELECT_SMS_CODE: {
          target: "enterPhoneVerificationCode",
        },
        SELECT_TOTP: {
          target: "beginningTotpSetup",
        },
      },
    },
    beginningTotpSetup: {
      on: {
        SUCCESS: {
          target: "setUpTotp",
        },
        FAILURE: {
          target: "previous",
        },
      },
    },
    setUpTotp: {
      on: {
        SUBMIT: {
          target: "submittingTotpSetup",
        },
        BACK: {
          target: "previous",
        },
      },
    },
    submittingTotpSetup: {
      on: {
        SUCCESS: {
          target: "setUpTotpSuccess",
        },
        FAILURE: {
          target: "setUpTotp",
        },
      },
    },
    setUpTotpSuccess: {
      on: {
        SUBMIT: {
          target: "signUpSuccess",
        },
      },
    },

    previous: {
      type: "history",
      history: "shallow",
    },
  },
};

const signupMachineOptions = {
  guards: {
    hasMultipleFirstFactors: (context: any, event: any) => {
      return context.flow.firstFactors?.length > 1;
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
    hasOnlySsoFirstFactor: (context: any) => {
      const factor = context.flow.firstFactors[0];
      return (
        factor.strategy === "apple" ||
        factor.strategy === "azure" ||
        factor.strategy === "google" ||
        factor.strategy === "github" ||
        factor.strategy === "twitter" ||
        factor.strategy === "facebook" ||
        factor.strategy === "linkedin"
      );
    },
    isMfaRequired: (context: any, event: any) => {
      return context.flow.isMfaRequired && !event.isSecondFactor;
    },
  },
};

export const defaultContext: Context = {
  // TODO these are some defaults
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
    ] as FactorList,
    secondFactors: [
      { channel: "sms", strategy: "verificationCode" },
      { channel: "authenticator", strategy: "totp" },
    ] as FactorList,
    isMfaRequired: true,
  } as Flow,
  tenantId: "demo1234",
  compact: false,
};

const createSignupMachine = (context: Context) => {
  return createMachine(signupMachineConfig, signupMachineOptions).withContext(
    context
  );
};

export default createSignupMachine;
