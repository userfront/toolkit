"use client";

import RequestPasswordResetForm from "./RequestPasswordResetForm";
import SetNewPasswordForm from "./SetNewPasswordForm";

/**
 * Combined password reset form: shows the "set new password" form if link credentials (uuid and token)
 * are present in the query parameters. Otherwise, shows the "request password reset" form.
 *
 * Use this if users both request a password reset and perform the reset at your password reset path.
 * If they are done at two different paths, use RequestPasswordResetForm and SetNewPasswordForm instead.
 *
 * @param {props} props
 * @param {boolean} props.shouldConfirmPassword - if true, in the SetNewPasswordForm, use a second password field
 *   to confirm the new password.
 *
 */

const PasswordResetForm = ({ shouldConfirmPassword = false }) => {
  // Check to see if the link credentials are present in the query string
  const url = new URL(window.location.href);
  const hasCredentials =
    url.searchParams.has("token") && url.searchParams.has("uuid");

  // Display the SetNewPasswordForm if credentials are present, otherwise display RequestPasswordResetForm
  // Note: Userfront.updatePassword() grabs the credentials from query params itself, so we don't need to
  // pass them along.
  if (hasCredentials) {
    return <SetNewPasswordForm shouldConfirmPassword={shouldConfirmPassword} />;
  }
  return <RequestPasswordResetForm />;
};

export default PasswordResetForm;
