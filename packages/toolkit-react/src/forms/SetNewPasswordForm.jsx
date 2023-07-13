"use client";

import { callUserfront, getUserfrontPropertySync } from "../services/userfront";
import SubmitButton from "../components/SubmitButton";
import ContinueButton from "../components/ContinueButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";
import SecuredByUserfront from "../components/SecuredByUserfront";
import { useState } from "react";
import { useSizeClass } from "../utils/hooks";

/**
 * Form to reset a user's password. Should be at the destination of the password reset email link.
 *
 * @param {props} props
 * @param {boolean} props.shouldConfirmPassword - if true, use a second password field to confirm the new password.
 * @returns
 */
const SetNewPasswordForm = ({ shouldConfirmPassword = false, redirect }) => {
  const [passwordRequired, setPasswordRequired] = useState(false);

  // Apply a CSS class based on the container's size
  const [containerRef, setContainerRef] = useState();
  const sizeClass = useSizeClass(containerRef);

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [showContinueButton, setShowContinueButton] = useState();
  const [title, setTitle] = useState("Set your new password");
  const [text, setText] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(redirect || "");

  // Check to see if the user is logged in
  // If so, we need to collect the existing password
  const user = getUserfrontPropertySync("user");
  const hasUser = !!(user && user.userId);

  // Try to reset the user's password.
  // If shouldConfirmPassword = true, check that both password fields match.
  // On success, display a message and a Continue button with the redirect URL.
  // On failure, show the error message from the server.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(undefined);
    const newPassword = event.target.elements.newPassword.value;

    // Only compare if we're asking users to confirm their password
    const confirmNewPassword = shouldConfirmPassword
      ? event.target.elements.confirmNewPassword.value
      : event.target.elements.newPassword.value;
    if (newPassword !== confirmNewPassword) {
      setError({
        message:
          "The passwords don't match. Please re-enter your new password.",
      });
      return;
    }

    // Do not submit if password is missing
    setPasswordRequired(!newPassword);
    if (!newPassword) return;

    try {
      setLoading(true);
      const args = { password: newPassword, redirect };
      if (hasUser) {
        args.existingPassword = event.target.elements.password.value;
      }
      const response = await callUserfront({
        method: "updatePassword",
        args: [args],
      });
      setSuccess(true);
      setLoading(false);
      // If there is a redirect sent from the server, CoreJS will do it here
      setTitle("New password set");
      if (redirect === false || (!redirect && !response.redirectTo)) {
        // No redirect is expected
        setText(`Success! Your password has been changed.`);
      } else {
        // Redirect is expected, but didn't happen for some reason
        setText(
          `Success! Your password has been changed. Click the button below to continue to the site.`
        );
        setShowContinueButton(true);
        // Set redirect URL from the response if one wasn't provided as a prop
        if (!redirect) {
          setRedirectUrl(response.redirectTo);
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  return (
    <div
      ref={setContainerRef}
      className={`userfront-toolkit userfront-container ${sizeClass}`}
    >
      <h2>{title}</h2>
      <p>{text}</p>
      {!success && (
        <form onSubmit={handleSubmit} className="userfront-form">
          {hasUser && (
            <div className="userfront-form-row">
              <Input.Password label="Enter your current password" />
            </div>
          )}
          <div className="userfront-form-row">
            <Input.Password
              name="newPassword"
              label="Choose a new password"
              showError={passwordRequired}
            />
          </div>
          {shouldConfirmPassword && (
            <div className="userfront-form-row">
              <label htmlFor="confirmNewPassword">
                Confirm your new password
              </label>
              <Input type="password" name="confirmNewPassword" />
            </div>
          )}
          <ErrorMessage error={error} />
          <div className="userfront-button-row">
            <SubmitButton />
          </div>
        </form>
      )}
      {showContinueButton && (
        <a href={redirectUrl}>
          <ContinueButton />
        </a>
      )}
      <div>
        <SecuredByUserfront />
      </div>
    </div>
  );
};

export default SetNewPasswordForm;
