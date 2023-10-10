import { Factor } from "../types";
export declare const factorConfig: {
  emailLink: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {
      type: string;
      message: string;
    };
  };
  emailCode: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {
      type: string;
      code: string;
    };
  };
  smsCode: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {
      type: string;
      phoneNumber: string;
      code: string;
    };
  };
  password: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {
      type: string;
      password: string;
    };
  };
  totp: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {
      type: string;
      totpCode: string;
      showEmailOrUsername: boolean;
      useBackupCode: boolean;
      backupCode: string;
      qrCode: string;
      backupCodes: any[];
      isMfaRequired: boolean;
      allowedSecondFactors: any[];
    };
  };
  ssoProvider: {
    channel: string;
    strategy: string;
    name: string;
    testIs: string;
    testOnlyFirst: string;
    testOnlySecond: string;
    viewContext: {};
  };
};
export declare const createOnlyFactorCondition: ({
  channel,
  strategy,
  secondFactor,
}: any) => (context: any) => boolean;
export declare const isMissing: (str: any) => boolean;
export declare const hasValue: (str: any) => str is string;
export declare const matchFactor: (a: Factor, b: Factor) => boolean;
export declare const getTargetForFactor: (
  factor: Factor
) =>
  | ""
  | "password"
  | "emailLink"
  | "emailCode"
  | "smsCode"
  | "totp"
  | "ssoProvider";
export declare const missingFlowError: (message: string) => {
  statusCode: number;
  message: string;
  error: {
    type: string;
  };
};
export declare const unhandledError: {
  statusCode: number;
  message: string;
  error: {
    type: string;
  };
};
