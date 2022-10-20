import {
  Factor,
  SignupContext,
  SetUpTotpContext,
  Password,
  PasswordSubmitEvent,
  UserfrontApiFactorResponseEvent,
  View,
} from "./types";
import { isMissing } from "./utils";

// GUARDS / PREDICATES

// Is this factor an SSO provider?
export const isSsoProvider = (factor: Factor) => {
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

// Is a second factor required to complete the signup or login?
export const secondFactorRequired = (
  context: SignupContext<any>,
  event: UserfrontApiFactorResponseEvent
) => {
  return event.data.isMfaRequired;
};

// Same as above, but check against the view context,
// for views that don't proceed directly from API call
// to second factor selection
export const secondFactorRequiredFromView = (context: SetUpTotpContext) => {
  return context.view.isMfaRequired;
};

export const isSecondFactor = (context: SignupContext<View>) => {
  return context.isSecondFactor;
};

// Do the "password" and "confirm password" fields match?
// (One of the few validations done locally.)
export const passwordsMatch = (
  context: SignupContext<Password>,
  event: PasswordSubmitEvent
) => event.password === event.confirmPassword;

// Is the tenantId absent?
export const isMissingTenantId = (context: SignupContext<any>) =>
  isMissing(context.config.tenantId);

// Are we in dev mode (isDevMode = true) without a flow set locally?
// This is an error state.
export const isDevModeWithoutFlow = (context: SignupContext<any>) => {
  return context.config.devMode && context.config.flow == null;
};

// Are we in local mode (shouldFetchFlow = false) without a flow set locally?
// This is an error state.
export const isLocalModeWithoutFlow = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow && context.config.flow == null;
};

// Is the auth flow absent?
export const isMissingFlow = (context: SignupContext<any>) => {
  return context.config.flow == null;
};

// Is the form in local mode (shouldFetchFlow = false)?
export const isLocalMode = (context: SignupContext<any>) => {
  return !context.config.shouldFetchFlow;
};

// Is there currently no factor selected for the form?
export const hasNoActiveFactor = (context: SignupContext<any>) =>
  context.activeFactor == null;

// Are we returning to the signup/login form after clicking a passwordless email link?
// If so, we need to check if a second factor is required to log in.
export const isReturningFromEmailLink = (context: SignupContext<any>) => {
  // TODO implementation based off reading query string -> in UserfrontCore
  return false;
};

// Are we returning to the signup/login form after authenticating with an SSO provider?
// If so, we need to check if a second factor is required to log in.
export const isReturningFromSsoFirstFactor = (context: SignupContext<any>) => {
  // TODO implementation based off reading query string -> in UserfrontCore
  return false;
};

// Is a second factor *not* required to signup/login?
// This effectively checks if we're signed in.
export const secondFactorNotRequired = (context: SignupContext<any>) => {
  // TODO implementation -> in UserfrontCore
  // effectively checking if we are signed in
  return false;
};