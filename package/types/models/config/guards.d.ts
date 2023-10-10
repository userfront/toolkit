import {
  Factor,
  AuthContext,
  TotpCodeContext,
  Password,
  PasswordSubmitEvent,
  UserfrontApiFactorResponseEvent,
  View,
  UserfrontApiFetchFlowEvent,
} from "../types";
export declare const isSsoProvider: (factor: Factor) => boolean;
export declare const secondFactorRequired: (
  context: AuthContext<any>,
  event: UserfrontApiFactorResponseEvent
) => boolean;
export declare const secondFactorRequiredFromView: (
  context: TotpCodeContext
) => boolean;
export declare const isSecondFactor: (context: AuthContext<View>) => boolean;
export declare const passwordsMatch: (
  context: AuthContext<Password>,
  event: PasswordSubmitEvent
) => boolean;
export declare const alwaysSucceed: () => boolean;
export declare const isMissingTenantId: (context: AuthContext<any>) => boolean;
export declare const isLocalModeWithoutFlow: (
  context: AuthContext<any>
) => boolean;
export declare const isMissingFlow: (context: AuthContext<any>) => boolean;
export declare const isMissingFlowFromServer: (
  context: AuthContext<any>,
  event: UserfrontApiFetchFlowEvent
) => boolean;
export declare const isLocalMode: (context: AuthContext<any>) => boolean;
export declare const hasNoActiveFactor: (context: AuthContext<any>) => boolean;
export declare const hasLinkQueryParams: (context: AuthContext<any>) => boolean;
export declare const isLoggedIn: () => boolean;
export declare const isLoggedInOrHasLinkCredentials: (
  context: AuthContext<any>
) => boolean;
export declare const isPasswordReset: (context: AuthContext<any>) => boolean;
export declare const isSetup: (context: AuthContext<any>) => boolean;
