/*
 * The Userfront CoreJS library is the default export
 * For ESM/UMD interop, we attach everything else to the default export
 */
import UserfrontCore from "@userfront/core";

/*
 * Fully functional Userfront forms
 * If you're using this library, these are probably what you're looking for!
 */
import SignupForm from "./packaged-forms/SignupForm";
import LoginForm from "./packaged-forms/LoginForm";
import PasswordResetForm from "./forms/PasswordResetForm";
import SetNewPasswordForm from "./forms/SetNewPasswordForm";
import LogoutButton from "./components/LogoutButton";

UserfrontCore.SignupForm = SignupForm;
UserfrontCore.LoginForm = LoginForm;
UserfrontCore.PasswordResetForm = PasswordResetForm;
UserfrontCore.SetNewPasswordForm = SetNewPasswordForm;
UserfrontCore.LogoutButton = LogoutButton;

/*
 * CSS styles for the forms
 */
import "./themes/default.css";

// TODO #9: add link to upgrade guide
UserfrontCore.build = (toolId) => {
  console.error(`Userfront.build(${toolId}) has been removed. Instead, import the component directly:
    import { SignupForm, LoginForm, PasswordResetForm, SetNewPasswordForm, LogoutButton } from "@userfront/react"
  See TODO DOCS LINK for more information about upgrading to the new toolkit.`);
};

/*
 * Dev tools.
 * You probably only want these if you're developing this library.
 */

// "Unbound" forms: the signup and login forms without a model to drive their behavior
import { default as UnboundSignupForm } from "./forms/SignupForm";
import { default as UnboundLoginForm } from "./forms/LoginForm";

// Factories for creating models to pair with the unbound forms
import {
  default as createSignupFormModel,
  defaultAuthContext as defaultSignupFormContext,
} from "./models/forms/signup";
import {
  default as createLoginFormModel,
  defaultAuthContext as defaultLoginFormContext,
} from "./models/forms/login";

// Function that allows overriding the Userfront singleton used by the forms with a custom object of your choice
import { overrideUserfrontSingleton } from "./services/userfront";
const _devTools = {
  UnboundSignupForm,
  UnboundLoginForm,
  createSignupFormModel,
  defaultSignupFormContext,
  createLoginFormModel,
  defaultLoginFormContext,
  overrideUserfrontSingleton,
};

UserfrontCore._devTools = _devTools;

export default UserfrontCore;
