import { AuthContext, FormError, FormType } from "../../src/models/types";
import { overrideUserfrontSingleton } from "../../src/services/userfront";
import Userfront from "@userfront/core";

import { factorConfig } from "../../src/models/config/utils";

export const createAuthContextForFactor = (name: string): AuthContext<any> => {
  const key = name as keyof typeof factorConfig;
  const view = factorConfig[key]?.viewContext ?? {};
  const context = {
    user: {
      email: "test@email.com",
      phoneNumber: "+15555555",
    },
    config: {
      type: "signup" as FormType,
      compact: false,
      locale: "en-US",
      mode: "live",
      shouldFetchFlow: true,
    },
    view,
    isSecondFactor: false,
    allowBack: false,
  };
  return context;
};

type Call = {
  method: string;
  args: any[];
  resolve: (result: any) => void;
  reject: (error: FormError) => void;
  id?: number;
};

const unexpectedResolve = () => {
  throw new Error(
    "Tried to resolve a call to the mock Userfront singleton before any calls were made."
  );
};

const unexpectedReject = () => {
  throw new Error(
    "Tried to reject a call to the mock Userfront singleton before any calls were made."
  );
};

export const createMockUserfront = () => {
  const calls: Call[] = [];
  const singleton = {
    store: {
      tenantId: "tenantId",
    },
  };
  const service = {
    get calls() {
      return calls;
    },
    get lastCall() {
      if (calls.length === 0) {
        return null;
      }
      return calls[calls.length - 1];
    },
    get resolve() {
      if (calls.length === 0) {
        return unexpectedResolve;
      }
      return calls[calls.length - 1].resolve;
    },
    get reject() {
      if (calls.length === 0) {
        return unexpectedReject;
      }
      return calls[calls.length - 1].reject;
    },
    singleton,
    proxy: {} as object,
    restoreUserfront: () => overrideUserfrontSingleton(Userfront),
  };
  let id = 0;
  const makeMethod = (key: string) => {
    return (...args: any[]) => {
      const promise = new Promise(
        (
          _resolve: (...args: any[]) => void,
          _reject: (...args: any[]) => void
        ) => {
          const resolve = (...args: any[]) => {
            _resolve(...args);
            return promise;
          };
          const reject = (...args: any[]) => {
            _reject(...args);
            return promise;
          };
          calls.push({
            method: key,
            args,
            resolve,
            reject,
            id: id++,
          });
        }
      );
      return promise;
    };
  };
  const singletonHandler = {
    get(target: object, key: keyof object) {
      if (target[key]) {
        return target[key];
      }
      return makeMethod(key);
    },
  };
  service.proxy = new Proxy(singleton, singletonHandler);
  return service;
};

export const useMockUserfront = () => {
  const service = createMockUserfront();
  overrideUserfrontSingleton(service.proxy);
  return service;
};

export function addBackToFactorsState<T extends { states?: object }>(
  machineConfig: T
): T {
  const states = {
    ...machineConfig.states,
    backToFactors: {
      id: "backToFactors",
    },
  };
  return {
    ...machineConfig,
    states,
  };
}
