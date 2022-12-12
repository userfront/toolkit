/**
 * @vitest-environment jsdom
 */
// CALL USERFRONT API
// Separate machine to be invoked as a service
// Purpose is to allow us to abstract away the Userfront API,
// instead use a simple model for MBT or whatever.

import { createMachine, assign, sendParent, MachineConfig } from "xstate";

export type CallUserfrontApiContext = {
  method: string;
  args: object;
  isDevMode: boolean;
  _devDataType?: string;
  result: object;
  error: object;
};

export type CallUserfrontApiEvents =
  | { type: "init" }
  | { type: "call" }
  | { type: "failure" }
  | { type: "successDev" }
  | { type: "success" };

export type CallUserfrontApiMachineConfig = MachineConfig<
  CallUserfrontApiContext,
  any,
  CallUserfrontApiEvents
>;

// Just some mock data to allow messing with the state machine
const _mockSuccess = {
  signupFirst: {
    isMfaRequired: true,
    authentication: {
      firstFactor: { channel: "email", strategy: "verificationCode" },
      secondFactors: [
        { channel: "sms", strategy: "verificationCode" },
        { channel: "authenticator", strategy: "totp" },
      ],
    },
  },
  signupSecond: {
    message: "OK",
    redirectTo: "https://my.redirect.com/path",
    tokens: {
      access: "mock access token",
    },
  },
  getDefaultAuthFlow: {
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
  getTenantId: {
    tenantId: "demo1234",
  },
  sendVerificationCode: {
    isMfaRequired: true,
    authentication: {
      firstFactor: { channel: "email", strategy: "verificationCode" },
      secondFactors: [
        { channel: "sms", strategy: "verificationCode" },
        { channel: "authenticator", strategy: "totp" },
      ],
    },
  },
  getTotpAuthenticatorQrCode: {
    qrCode:
      "https://en.wikipedia.org/wiki/QR_code#/media/File:QR_code_for_mobile_English_Wikipedia.svg",
    backupCodes: ["backup1", "backup2", "backup3"],
  },
};

declare global {
  var Userfront: any;
}

export const READ = "__read__";

let callMethod = async (method: string, ...args: any) => {
  if (!window || !window.Userfront || !window.Userfront.store.tenantId) {
    console.warn(
      "Tried to call a Userfront method before the Userfront service was initialized."
    );

    // TODO: Remove this test code prior to merge. Throw error instead.
    if (method === "sendResetLink") {
      const email = args;
      return Promise.resolve({
        message: "OK",
        result: {
          email,
          submittedAt: "2022-11-12T03:04:46.290Z",
          messageId: "ed2052f6-da85-48aa-a24e-3eab4c5b08d0",
        },
      });
    }
    if (method === "signup") {
      switch (args[0].method) {
        case "passwordless":
        case "password":
        case "verificationCode":
          return Promise.resolve(_mockSuccess.signupFirst);
        case "azure":
        case "google":
        case "facebook":
        case "github":
        case "linkedin":
        case "twitter":
          console.log(
            `Called signup method for ${args[0].method} - expect userfront/core to redirect there.`
          );
          return Promise.resolve({});
        default:
          return Promise.resolve(_mockSuccess.signupSecond);
      }
    }
    // @ts-ignore
    return Promise.resolve(_mockSuccess[method]);
  }
  if (method === READ) {
    if (!args[0]?.key) {
      console.warn(
        "Tried to read a key from the Userfront object, but no key was provided."
      );
      return Promise.reject();
    }
    return Promise.resolve({ value: window.Userfront[args[0].key] });
  }
  if (!window.Userfront[method]) {
    console.warn(`Method ${method} not found on Userfront object.`);
    if (method === "getDefaultAuthFlow") {
      return Promise.resolve(_mockSuccess.getDefaultAuthFlow);
    }
    return Promise.reject();
  }
  try {
    const result = await window.Userfront[method](...args);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

const defaultOptions = {
  services: {
    callMethod: (context: CallUserfrontApiContext) =>
      callMethod(context.method, context.args),
  },
};

export const config: CallUserfrontApiMachineConfig = {
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
          // Succeed with some dummy data if we're in dev mode
          target: "successDev",
          cond: (context) => context.isDevMode,
        },
        {
          // Call the API method
          target: "call",
        },
      ],
    },
    call: {
      // Call the API method, await its result
      invoke: {
        src: "callMethod",
        // On success, record the data
        onDone: {
          target: "success",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            result: event.data,
          })),
        },
        // On error, record the error
        onError: {
          target: "failure",
          actions: assign((context: CallUserfrontApiContext, event) => ({
            ...context,
            error: event.data,
          })),
        },
      },
    },
    // If we succeeded, return "done" to the parent with the result as data
    success: {
      type: "final",
      data: (context) => context.result,
    },
    // If we failed, return "done" to the parent with an error flag and error as data
    failure: {
      type: "final",
      data: (context) => ({ _isError: true, error: context.error }),
    },
    // If we're in dev mode, return "done" to the parent with some dummy data
    // TODO dummy data generation
    successDev: {
      type: "final",
      data: {},
    },
  },
};

export const callUserfrontApi = createMachine(config, defaultOptions);

/* UNIT TESTS */
import { interpret } from "xstate";

if (import.meta.vitest) {
  const { describe, it, expect, vi, afterEach, beforeEach, afterAll } =
    import.meta.vitest;
  describe("models/userfrontApi.ts", () => {
    let originalCallMethod = callMethod;
    beforeEach(() => {
      // callMethod = vi
      //   .fn()
      //   .mockImplementation(() =>
      //     Promise.reject("called method without specific mock implementation")
      //   );
      window.Userfront = {
        store: {
          tenantId: "someTenantId",
        },
      };
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    afterAll(() => {
      callMethod = originalCallMethod;
    });

    it("should short-circuit to successDev if the context is in dev mode", async () => {
      const context = {
        method: "method",
        args: [],
        isDevMode: true,
        _devDataType: "test",
        result: {},
        error: {},
      };
      const expectedValue = "successDev";
      const machine = callUserfrontApi.withContext(context);
      return new Promise<void>((resolve, reject) => {
        const service = interpret(machine).onTransition((state) => {
          if (state.matches(expectedValue)) {
            resolve();
          }
          if (state.matches("call")) {
            reject();
          }
        });

        service.start();
      });
    });
    it("should call the method with the arguments if the context is not in dev mode", async () => {
      window.Userfront.method = () => ({ value: "someValue" });
      const context = {
        method: "method",
        args: [],
        isDevMode: false,
        _devDataType: "test",
        result: {},
        error: {},
      };
      const expectedValue = "success";
      const machine = callUserfrontApi.withContext(context);
      return new Promise<void>((resolve, reject) => {
        const service = interpret(machine).onTransition((state) => {
          if (state.matches(expectedValue)) {
            expect(state.context.result).toEqual({ value: "someValue" });
            resolve();
          }
          if (state.matches("successDev")) {
            reject();
          }
        });

        service.start();
      });
    });
    it("should read a value from the Userfront object if the method is READ and a key is provided", async () => {
      window.Userfront.someKey = "someValue";
      const context = {
        method: READ,
        args: { key: "someKey" },
        isDevMode: false,
        _devDataType: "test",
        result: {},
        error: {},
      };
      const expectedValue = "success";
      const machine = callUserfrontApi.withContext(context);
      return new Promise<void>((resolve, reject) => {
        const service = interpret(machine).onTransition((state) => {
          if (state.matches(expectedValue)) {
            expect(state.context.result).toEqual({ value: "someValue" });
            resolve();
          }
          if (state.matches("successDev")) {
            reject();
          }
        });
        service.start();
      });
    });
  });
}
