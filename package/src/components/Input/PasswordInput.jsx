import BaseInput from "./BaseInput";

/**
 * An <input> with toggle to show / hide the password
 *
 * @param {object} props
 * @returns
 */
export default function PasswordInput({
  label = "Password",
  showError,
  errorMessage = "Please enter your password",
  ...props
}) {
  return (
    <BaseInput
      isPassword
      name="password"
      aria-describedby="userfront-password-rules"
      showError={showError}
      errorMessage={errorMessage}
      label="Choose a password"
      {...props}
    />
  );
}
