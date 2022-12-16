// Interface for userfront-core,
// for uniformity for Logout and PasswordReset forms that don't
// need a state machine to describe their behavior.

import Userfront from "@userfront/core";

interface Store {
  tenantId?: string;
}

declare module "@userfront/core" {
  const store: Store;
}

let singleton = Userfront;

export const overrideUserfrontSingleton = (newSingleton: any) => {
  singleton = newSingleton as typeof Userfront;
};

// A type with the keys of all functions in Type
type Functions<Type> = {
  [Key in keyof Type]-?: Type[Key] extends Function ? Key : never;
}[keyof Type];

export interface CallUserfront {
  method: Functions<typeof singleton>;
  args: Array<Object>;
}

export const getUserfrontProperty = async (key: string) => {
  if (!key) {
    console.warn(
      "Tried to read a key from the Userfront object, but no key was provided."
    );
    return Promise.reject();
  }
  if (key in singleton) {
    return singleton[<keyof typeof singleton>key];
  } else if (key in singleton.store) {
    return singleton.store[<keyof typeof singleton.store>key];
  }
  console.warn(
    `Tried to read key ${key} from the Userfront object, but no such key was found in the object or object.store.`
  );
  return undefined;
};

export const callUserfront = async ({ method, args = [] }: CallUserfront) => {
  if (!singleton || !singleton.store?.tenantId) {
    console.warn(
      "Tried to call a Userfront method before the Userfront service was initialized."
    );
    return Promise.reject();
  }
  if (!singleton[method] || !(typeof singleton[method] === "function")) {
    console.warn(`Method ${method} not found on Userfront object.`);
    // TODO: let us get past the form setup step by returning a dummy object
    // @ts-ignore
    if (method === "getDefaultAuthFlow") {
      return Promise.resolve({
        firstFactors: [
          { strategy: "password", channel: "email" },
          { strategy: "link", channel: "email" },
        ],
        secondFactors: [{ strategy: "totp", channel: "authenticator" }],
        isMfaRequired: false,
        isEnabled: true,
      });
    }
    return Promise.reject();
  }
  try {
    return await (<any>singleton[method])(...args);
  } catch (err: any) {
    console.warn(
      `Method ${method} on Userfront object threw. Error: ${err.message}`
    );
    return Promise.reject(err);
  }
};
