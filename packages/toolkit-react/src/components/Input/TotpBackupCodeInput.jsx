import BaseInput from "./BaseInput";

export default function TotpBackupCodeInput({
  label = "Backup code",
  placeholder,
  showError,
  errorMessage = "Please enter your backup code",
}) {
  return (
    <BaseInput
      label={label}
      type="tel"
      name="totpBackupCode"
      placeholder={placeholder}
      showError={showError}
      errorMessage={errorMessage}
    />
  );
}
