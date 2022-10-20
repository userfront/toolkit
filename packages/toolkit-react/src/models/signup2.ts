import { createMachine, assign, send, sendParent } from "xstate";

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
  return new Promise((resolve, reject) => {
    resolve({ data: "data" });
  });
};

const isRetriableError = (response: any) => {
  return true;
};

type RequestContext = {
  isDevMode: boolean;
  tenantId: string;
  endpoint: string;
  method: string;
  body: string | object;
  _devDataType: string;
  responseJson: object;
  error: object;
  retryWaitTime: number;
  numRetries: number;
  maxRetries: number;
};

const sendRequest = createMachine({
  id: "sendRequest",
  initial: "init",
  context: {
    isDevMode: false,
    tenantId: "",
    endpoint: "",
    method: "",
    body: "",
    _devDataType: "",
    responseJson: {},
    error: {},
    retryWaitTime: 100,
    numRetries: 0,
    maxRetries: 10,
  } as RequestContext,
  states: {
    init: {
      always: [
        {
          target: "successDev",
          cond: (context) => context.isDevMode,
        },
        {
          target: "failure",
          cond: (context) => {
            return (
              isMissing(context.tenantId) ||
              isMissing(context.endpoint) ||
              isMissing(context.method)
            );
          },
          actions: assign((context: RequestContext, event) => ({
            ...context,
            error: {
              message: "Missing tenantId, endpoint, or method for request.",
            },
          })),
        },
        {
          target: "sendingRequest",
        },
      ],
    },
    sendingRequest: {
      invoke: {
        id: "fetch",
        src: (context, event) =>
          performRequest({
            tenantId: context.tenantId,
            endpoint: context.endpoint,
            method: context.method,
            body: context.body,
          }),
        onDone: {
          target: "success",
          actions: assign((context: RequestContext, event) => ({
            ...context,
            responseJson: event.data,
          })),
        },
        onError: [
          {
            target: "waitForRetry",
            cond: (context, event) =>
              isRetriableError(event.data) &&
              context.numRetries < context.maxRetries,
          },
          {
            target: "failure",
            actions: assign((context: RequestContext, event) => ({
              ...context,
              responseError: event.data,
            })),
          },
        ],
      },
    },
    waitForRetry: {
      after: [
        {
          delay: (context, event) => context.retryWaitTime,
          target: "sendingRequest",
        },
      ],
      exit: assign((context: RequestContext) => {
        return {
          ...context,
          retryWaitTime: context.retryWaitTime * 2,
          numRetries: context.numRetries + 1,
        };
      }),
    },
    failure: {
      // entry: (context : RequestContext, event) => escalate(context.error)
      type: "final",
      entry: (context) => sendParent("error", context.responseJson),
    },
    success: {
      type: "final",
      data: (context) => context.responseJson,
    },
    successDev: {
      type: "final",
      data: {},
    },
  },
});

type CallUserfrontApiContext = {
  method: string;
  args: object;
  isDevMode: boolean;
  _devDataType: string;
  result: object;
  error: object;
};

const callMethod = (method: any, args: any) => {
  return Promise.resolve({ result: "result" });
};

const callUserfrontApi = createMachine({
  id: "callUserfrontApi",
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

type OptionalFieldConfig = "hide" | "allow" | "require";

type EmailLinkContext = {
  email: string;
  name: string;
  username: string;
  errorMessage: string;
  allowBack: boolean;
  nameConfig: OptionalFieldConfig;
  usernameConfig: OptionalFieldConfig;
};

const defaultEmailLinkContext = {
  email: "",
  name: "",
  username: "",
  errorMessage: "",
  allowBack: true,
  nameConfig: "hide",
  usernameConfig: "hide",
};

const isValidEmail = (email: string) => true;
const getValidationErrorMessage = (email: string) => "Invalid email";

const emailLinkMachine = createMachine({
  id: "emailLink",
  initial: "showForm",
  context: {} as EmailLinkContext,
  states: {
    showForm: {
      on: {
        submit: [
          {
            actions: assign((context: EmailLinkContext, event: any) => ({
              ...context,
              email: event.email,
              name: event.name,
              username: event.username,
            })),
            target: "send",
            cond: (context: EmailLinkContext, event: any) =>
              isValidEmail(event.email),
          },
          {
            actions: assign((context: EmailLinkContext, event: any) => ({
              ...context,
              errorMessage: getValidationErrorMessage(event.email),
            })),
            target: "showForm",
          },
        ],
        back: {
          actions: (context) => sendParent("back"),
        },
      },
    },
    send: {
      entry: assign((context: EmailLinkContext) => ({
        ...context,
        errorMessage: "",
      })),
      invoke: {
        src: callUserfrontApi,
        data: (context: EmailLinkContext, event: any) => {
          const args = {
            method: "passwordless",
            email: context.email,
          } as any;
          if (hasValue(context.name)) {
            args.name = context.name;
          }
          if (hasValue(context.username)) {
            args.username = context.username;
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
          actions: assign((context: EmailLinkContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showForm",
        },
      },
    },
    showEmailSent: {
      on: {
        finish: "finish",
        resend: "send",
        back: "showForm",
      },
    },
    finish: {
      type: "final",
    },
  },
});

type EmailCodeContext = {
  email: string;
  name: string;
  username: string;
  errorMessage: string;
  allowBack: boolean;
  nameConfig: OptionalFieldConfig;
  usernameConfig: OptionalFieldConfig;
  code: string;
};

const defaultEmailCodeContext = {
  email: "",
  name: "",
  username: "",
  errorMessage: "",
  allowBack: true,
  nameConfig: "hide",
  usernameConfig: "hide",
  code: "",
};

const emailCodeMachine = createMachine({
  id: "emailCode",
  initial: "showForm",
  context: {} as EmailCodeContext,
  states: {
    showForm: {
      on: {
        submit: [
          {
            actions: assign((context: EmailCodeContext, event: any) => ({
              ...context,
              email: event.email,
              name: event.name,
              username: event.username,
            })),
            target: "send",
            cond: (context: EmailCodeContext, event: any) =>
              isValidEmail(event.email),
          },
          {
            actions: assign((context: EmailCodeContext, event: any) => ({
              ...context,
              errorMessage: getValidationErrorMessage(event.email),
            })),
            target: "showForm",
          },
        ],
        back: {
          actions: (context) => sendParent("back"),
        },
      },
    },
    send: {
      entry: assign((context: EmailCodeContext) => ({
        ...context,
        errorMessage: "",
      })),
      invoke: {
        src: callUserfrontApi,
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.email,
          } as any;
          if (hasValue(context.name)) {
            args.name = context.name;
          }
          if (hasValue(context.username)) {
            args.username = context.username;
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
          actions: assign((context: EmailCodeContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showForm",
        },
      },
    },
    showCodeForm: {
      on: {
        submit: {
          actions: assign((context: EmailCodeContext, event: any) => ({
            ...context,
            code: event.code,
          })),
          target: "verifyCode",
        },
        resend: "send",
        back: "showForm",
      },
    },
    verifyCode: {
      entry: assign((context: EmailCodeContext) => ({
        ...context,
        errorMessage: "",
      })),
      invoke: {
        src: callUserfrontApi,
        data: (context: EmailCodeContext, event: any) => {
          const args = {
            method: "verificationCode",
            email: context.email,
          } as any;
          return {
            method: "verifyCode",
            args,
          };
        },
        onDone: {
          actions: () => {
            console.log("redirectIfSignedIn");
          },
        },
        onError: {
          actions: assign((context: EmailCodeContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showCodeForm",
        },
      },
    },
  },
});

type PasswordContext = {
  email: string;
  password: string;
  name: string;
  username: string;
  nameConfig: OptionalFieldConfig;
  usernameConfig: OptionalFieldConfig;
  allowBack: boolean;
  errorMessage: string;
};

const defaultPasswordContext = {
  email: "",
  password: "",
  name: "",
  username: "",
  nameConfig: "hide",
  usernameConfig: "hide",
  allowBack: false,
  errorMessage: "",
};

const isValidPassword = (password: string) => true;

const getPasswordValidationErrorMessage = (email: string, password: string) =>
  "Bad email or password";

const passwordMachine = createMachine({
  id: "password",
  initial: "showForm",
  context: {} as PasswordContext,
  states: {
    showForm: {
      on: {
        submit: [
          {
            actions: assign((context: PasswordContext, event: any) => ({
              ...context,
              email: event.email,
              name: event.name,
              username: event.username,
            })),
            target: "send",
            cond: (context: PasswordContext, event: any) =>
              isValidEmail(event.email) && isValidPassword(event.password),
          },
          {
            actions: assign((context: PasswordContext, event: any) => ({
              ...context,
              errorMessage: getPasswordValidationErrorMessage(
                event.email,
                event.password
              ),
            })),
            target: "showForm",
          },
        ],
        back: {
          actions: (context) => sendParent("back"),
        },
      },
    },
    send: {
      entry: assign((context: PasswordContext) => ({
        ...context,
        errorMessage: "",
      })),
      invoke: {
        src: callUserfrontApi,
        data: (context: PasswordContext, event: any) => {
          const args = {
            method: "password",
            email: context.email,
            password: context.password,
          } as any;
          if (hasValue(context.name)) {
            args.name = context.name;
          }
          if (hasValue(context.username)) {
            args.username = context.username;
          }
          return {
            method: "signup",
            args,
          };
        },
        onDone: {
          actions: () => {
            console.log("redirectIfSignedIn");
          },
        },
        onError: {
          actions: assign((context: PasswordContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showForm",
        },
      },
    },
  },
});

type SetUpTotpContext = {
  qrCode: string;
  totpCode: string;
  errorMessage: string;
  backupCodes: string[];
  allowBack: boolean;
};

const defaultSetUpTotpContext = {
  qrCode: "",
  totpCode: "",
  errorMessage: "",
  backupCodes: [],
  allowBack: true,
};

const setUpTotpMachine = createMachine({
  id: "setUpTotp",
  initial: "getQrCode",
  context: {} as SetUpTotpContext,
  states: {
    getQrCode: {
      invoke: {
        src: callUserfrontApi,
        data: (context: SetUpTotpContext, event: any) => ({
          method: "getTotpAuthenticatorQrCode",
          args: {},
        }),
        onDone: {
          actions: assign((context: SetUpTotpContext, event: any) => ({
            ...context,
            qrCode: event.data.qrCode,
            backupCodes: event.data.backupCodes,
          })),
          target: "showQrCode",
        },
        onError: {
          actions: assign((context: SetUpTotpContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showErrorMessage",
        },
      },
    },
    showQrCode: {
      on: {
        submit: {
          actions: assign((context: SetUpTotpContext, event: any) => ({
            ...context,
            totpCode: event.totpCode,
          })),
          target: "confirmTotpCode",
        },
        back: {
          actions: (context) => sendParent("back"),
        },
      },
    },
    confirmTotpCode: {
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
          actions: assign((context: SetUpTotpContext, event: any) => ({
            ...context,
            errorMessage: event.data.message,
          })),
          target: "showQrCode",
        },
      },
    },
    showBackupCodes: {
      on: {
        finish: {
          actions: () => console.log("redirectIfSignedIn"),
        },
      },
    },
    showErrorMessage: {
      on: {
        retry: "getQrCode",
        back: {
          actions: () => sendParent("back"),
        },
      },
    },
  },
});

// -- new signup form machine

const getTargetForFactor = (factor: Factor) => {
  return "target";
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

type SignupContext = {
  flow: Flow | null;
  tenantId: string;
  shouldFetchFlow: boolean;
  isDevMode: boolean;
  errorMessage: string;
  activeFactor: Factor | null;
};

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

export const defaultSignupContext = {
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
  isDevMode: false,
  errorMessage: "",
  activeFactor: null,
};

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

export const defaultSignupOptions = {
  guards: {
    hasMultipleFirstFactors: (context: SignupContext, event: any) => {
      return (context.flow?.firstFactors?.length ?? 0) > 1;
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
    hasOnlySsoFirstFactor: (context: SignupContext) => {
      const factor = context.flow?.firstFactors[0];
      if (!factor) {
        return false;
      }
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
    isMfaRequired: (context: SignupContext, event: any) => {
      return !!(context.flow?.isMfaRequired && !event.isSecondFactor);
    },
    isEmailLink: (_1: any, event: any) => {
      return matchFactor(event.factor, Factors.EmailLink);
    },
    isEmailCode: (_1: any, event: any) => {
      return matchFactor(event.factor, Factors.EmailCode);
    },
    isSmsCode: (_1: any, event: any) => {
      return matchFactor(event.factor, Factors.SmsCode);
    },
    isPassword: (_1: any, event: any) => {
      return matchFactor(event.factor, Factors.Password);
    },
    isTotp: (_1: any, event: any) => {
      return matchFactor(event.factor, Factors.Totp);
    },
    isSsoProvider: (_1: any, event: any) => {
      return isSsoProvider(event.factor);
    },
  },
};

const createSignupMachine = (initialContext: SignupContext) =>
  /** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYFcAOA6F6KALgMSKjYD2qRKl65IAHogMwCM7uHATAKwAGPuwAsAdj4jWrADQgAnogCcYkbiUaAHJqU8h-TawC+Ruagw5cMIgHEANpQBGAQzsAVMOmfoiASQgkEPRg+OgAbpQA1iHmWHjW9k6uHl4+-ggEEQDGzrT0ANoCALqMVDR0DEjMiBJqfLysInx8YqxicooI7ALsAGy4IlrahhJivWImZmhxocQAYg4A7mRVZcQVjCxdPNq47Hy9PCIimnxHByIdiDr9GhoCAirdYn2TILGWsAAWlIsACnZnFkwD87BAwAAnACC6AgczARCyXwWv0CwVCEWiuA+eG+vwBQJBlDBkJhcIRSJRiwy4UoOTy6EKJVW1HW9E2bE43HY-CEolq0iuCBOAm40mkIgeqj6xlM72mnx+-0BwNB4OhsPhiORSxIkIhlAhuGwgKIADNDQBbbEK3FKgmq4nqslaylLGnZXIVJmlVkMjkIDhcXiCYTiSSChSIXqafrioPaM6sXqyqYWO34iFgMIoMCLF0UnWooLoEKZKIxW3Y+1ZnN5gvaqkeulegrFX3ldlVLZB7m8sMC2RRhA8Vg8MUS9hKHktHjsN446uZ7O5-OawtUvUQg1Gk25C0Q62LvH-Wurhtu37N+ne9sszuVUA9rkhvnhqRDzoHMQT6SxgSNG085yseNYrvW66NrqsBgHYYBZEQcxAkQhodmyj7VF0U64M04gCDwEiaGIOgCL0QoiARuCGNIfR6JISgtAuVaOGAUAEJuaH+t2NSSDhDRNC0bRCmOfDqHc9yaAIYgMWMTHptisHwYhKAQrAiHIYaJAwXBCEAKKWs4KB2AAMgQkScRs3HbLs+yHMcpznL0lzDoMoriQxkqsCo04iHJMzaUpcwqWpSEIZpAV6QZRkAMKUOCFldk+iA8jZBxHCcZxNE5wl6GJdz7B+c4TCBVYRcpqnqWFEJaYpCEAMqWrAsXxfe6EBilmh7Gl9mZRcQpiKOAxDEcAH8nwfmfLV5UhRp1VlX8ziwLAiyGhACUYVsHVdXZGWOc5nT7G5dxETGPC9E5-ATbiU1BRVoUoXNU11bAlB-AaObqut7U7J1tnpQ5WX7dcJx5SRgxzscPBXbgYBRSZZloqWGIVja8mw4Z8PoJE16toyd4UH6llJV0rTjmdBxARKShNORPBKHlWgvEGIjAWmMzozFcVgIjZa0lii4c3YzVgDjDI+q1XHE+wpO4OTKZM401N8EK-D0+5u1ZeM0OwI1ws88j-OlbrXOi7ezIEw+AY8Gd469GlxHjNOvRKCrrCiiz53SXwSgxnyUMlfJ2CLctq36+WhuB8HK0QhApttubIBrJLmHS2Ost2-L7BUzTw46AzSiPNO0m6P7bOWCxbHoHV8H0HCs0rBbbVWRD-Q9AcWejizsafogkru30MaNC0IiHIxAf+U9NeavXZUNU1XNfVZvavgOEY9wgBe3Iz0jU9Tzva5PWS1-d4VTW4lBENgi-E8vM5voO-VEQzbsSGOsbjePnzG+C1dH9PVVhz5pWeSOt54-ynnXKqcc8YJyTkTTCtQ+I8iHoJdow5N6g1aF5QYI8lAHyIAAVWwOfS+gDMTAInoQ4hF9sDQPFo3ZOWxEH1GQQJVoaDOjER-OJF+9Qdh2xMHKdAXN4BVEXC4LI5kJbwM2lyXCMZhDdFIkXIUPsuCDA0FnJQHBTgAWhgQYg19MJznpq+UeQhtB0yFN0N2Q0lDaBZoMFMkhoYJAcC4dwnhvB+DWtIxKmF6g-gzqOAQ2ghD1GVsOJRahxJTk0GNfen88AGMQksIxsiWay3YERQQ05dACCBl0AC7shiOJ9qwFxSTcCWhQEtAgUAqS+HQAAEWzAAWS5rpbcqE-EbWSicNQGiJJSQYpoaxDwYnb1OE0E4eCqk1LqegBpSwmnGRbHYDp4Iuk7nSb3ccJFeh9GnEone-VVB2Pfl5LhUloYLNQEsqkcwDSWmrhCMIkJtk9IYTIxAggglpUUcU44DEhQpk6g8B41timqzmWXDMypCRqlJJBS8ixdnCh4KC1gnVqIVPqM47R2swJ1jXOSKCvx0V21wI8NoKZegFOtvsMZw5hD01xXoSS+w+gfzhbgCu7E0m9IDJIH8I8KleQYqE7JzLOgZTsRoZMw9pyXSqWVW6M0qros4NLHCtlsnYulnTGVvdTjyu0XbVQyqeXyjRnDUyWMtVhnUE0N2eg5xSWtuRel1KIV0zHGdHkvRoaC2Fo60Qzr6j4Xws8T1w46aighfhSQhyGLCGtceb+YB0VHG0VRCQ+E9D0p0CC4cntcCWu0aRQ5yZDjQyDktaOvjvn+M2k6pWrro0esxVE3Kia5z0p5CoYqvKlqvXeigT6QqrKiE0IM8SoSRl8GNQgWd45jonQoocrO0N+VVwgSfCEWrykDFndivkZxzjkQGrLQQQhpwFM0ARcQB8dJEF-sfWaWrrbqFIqOelOxHjjA4dcXNGjJKSS8iw1mNr-KZvff-B66KzidTltkqcxEdDsCFDkhmUkOAVMkr5VVCIiEkKvlO4mgTcDBLdmE5oFT+oHAZk5cYU49DQcXGaAx3wtWcB-Gmw5hh4kDXsdh6coNxizoLvE2FMGcBauXTq9yymtBBsEUAA */
  createMachine(
    {
      context: { ...defaultSignupContext, ...initialContext },
      id: "signup",
      initial: "init",
      states: {
        back: {
          history: "shallow",
          type: "history",
        },
        init: {
          always: [
            {
              cond: (context) => isMissing(context.tenantId),
              target: "getGlobalTenantId",
            },
            {
              target: "initFlow",
            },
          ],
        },
        getGlobalTenantId: {
          invoke: {
            src: callUserfrontApi,
            onDone: [
              {
                actions: (context: SignupContext, event) => {
                  if (hasValue(event.data.tenantId)) {
                    return assign({
                      ...context,
                      tenantId: event.data.tenantId,
                    });
                  } else {
                    return assign({
                      ...context,
                      isDevMode: true,
                    });
                  }
                },
                target: "initFlow",
              },
            ],
          },
        },
        initFlow: {
          always: [
            {
              cond: (context) => context.isDevMode && context.flow === null,
              target: "missingFlowInDevModeError",
            },
            {
              cond: (context) =>
                !context.shouldFetchFlow && context.flow === null,
              target: "missingFlowInLocalModeError",
            },
            {
              cond: (context) => context.flow === null,
              target: "showPlaceholderAndFetchFlow",
            },
            {
              cond: (context) => !context.shouldFetchFlow || context.isDevMode,
              target: "beginFlow",
            },
            {
              target: "showPreviewAndFetchFlow",
            },
          ],
        },
        missingFlowInDevModeError: {
          entry: assign({ errorMessage: "Missing flow in dev mode" }),
        },
        missingFlowInLocalModeError: {
          entry: assign({ errorMessage: "Missing flow in local mode" }),
        },
        missingFlowFromServerError: {
          entry: assign({ errorMessage: "Missing flow from server" }),
        },
        showPlaceholderAndFetchFlow: {
          invoke: {
            src: callUserfrontApi,
            onDone: [
              {
                actions: (context: SignupContext, event) =>
                  assign({ ...context, flow: event.data }),
                target: "beginFlow",
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
                actions: (context: SignupContext, event) =>
                  assign({ ...context, flow: event.data }),
                cond: (context) => context.activeFactor === null,
                target: "beginFlow",
              },
              {
                actions: (context: SignupContext, event) => {
                  const actionList = [];
                  actionList.push(assign({ ...context, flow: event.data }));
                  const target = getTargetForFactor(context.activeFactor!);
                  actionList.push(send(target));
                  return actionList;
                },
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
              actions: (context: SignupContext, event: any) =>
                assign({ ...context, activeFactor: event.factor }),
            },
          },
        },
        beginFlow: {
          always: [
            {
              cond: "hasMultipleFirstFactors",
              target: "selectFirstFactor",
            },
            {
              cond: "hasOnlyEmailLinkFirstFactor",
              target: "emailLink",
            },
            {
              cond: "hasOnlyEmailCodeFirstFactor",
              target: "emailCode",
            },
            {
              cond: "hasOnlySmsCodeFirstFactor",
              target: "smsCode",
            },
            {
              cond: "hasOnlyPasswordFirstFactor",
              target: "password",
            },
            {
              cond: "hasOnlySsoFirstFactor",
              target: "selectFirstFactor",
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
            ],
          },
        },
        emailLink: {
          invoke: {
            src: emailLinkMachine,
            id: "emailLink",
            onDone: [
              {
                cond: "isMfaRequired",
                target: "beginSecondFactor",
              },
              {
                target: "finish",
              },
            ],
          },
        },
        emailCode: {
          invoke: {
            src: emailCodeMachine,
            id: "emailCode",
            onDone: [
              {
                cond: "isMfaRequired",
                target: "beginSecondFactor",
              },
              {
                target: "finish",
              },
            ],
          },
        },
        smsCode: {
          invoke: {
            src: emailCodeMachine,
            id: "smsCode",
            onDone: [
              {
                cond: "isMfaRequired",
                target: "beginSecondFactor",
              },
              {
                target: "finish",
              },
            ],
          },
        },
        password: {
          invoke: {
            src: passwordMachine,
            id: "password",
            onDone: [
              {
                cond: "isMfaRequired",
                target: "beginSecondFactor",
              },
              {
                target: "finish",
              },
            ],
          },
        },
        ssoProvider: {
          type: "final",
        },
        beginSecondFactor: {
          always: [
            {
              cond: "hasOnlySmsCodeSecondFactor",
              target: "smsCode",
            },
            {
              cond: "hasOnlyTotpSecondFactor",
              target: "setUpTotp",
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
        smsCodeSecondFactor: {
          invoke: {
            src: emailCodeMachine,
            id: "smsCode",
            onDone: [
              {
                target: "finish",
              },
            ],
          },
        },
        setUpTotp: {
          invoke: {
            src: setUpTotpMachine,
            id: "setUpTotp",
            onDone: [
              {
                target: "finish",
              },
            ],
          },
        },
        finish: {
          type: "final",
        },
      },
    },
    defaultSignupOptions
  );

// do we need to refactor AGAIN into nested/hierarchical machines instead
// of invoked machines? I think so... that way the form can be described
// by one single state + context instead of multiple states + contexts.
//
// ALSO: to better accommodate future changes, instead of selectFirstFactor
// and selectSecondFactor - have a selectFactor step that accepts data from
// the server and shows whatever. Maybe?
//
// ALSO: need to handle cases where we land back on the page directly from
// SSO signup -- i.e. Google SSO first factor, TOTP second factor.
//
//

export default createSignupMachine;
