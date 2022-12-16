export { default as UnboundSignupForm } from "./forms/SignupForm";
export { default as UnboundLoginForm } from "./forms/LoginForm";
export { default as SignupForm } from "./packaged-forms/SignupForm";
export { default as LoginForm } from "./packaged-forms/LoginForm";
export { default as PasswordResetForm } from "./forms/PasswordResetForm";
export { default as SetNewPasswordForm } from "./forms/SetNewPasswordForm";
export { default as LogoutButton } from "./components/LogoutButton";
export {
  default as createSignupFormModel,
  defaultAuthContext as defaultSignupFormContext,
} from "./models/forms/signup";
export {
  default as createLoginFormModel,
  defaultAuthContext as defaultLoginFormContext,
} from "./models/forms/login";

import Userfront from "@userfront/core";
export default Userfront;

import { overrideUserfrontSingleton } from "./services/userfront";
export const _devTools = {
  overrideUserfrontSingleton,
};

import "./themes/default.css";
