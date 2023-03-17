import BaseInput from "./BaseInput";

export default function PasswordInput({
  label = "Password",
  showError,
  errorMessage = "Please enter your password",
}) {
  return (
    <BaseInput
      label={label}
      type="password"
      name="password"
      aria-describedby="userfront-password-rules"
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
