import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * A view prompting the user to enter their TOTP authenticator code,
 * or a backup code.
 *
 * @param {object} props
 * @param {boolean} props.showEmailOrUsername - if true, show an input for the user's email or username.
 *   Necessary if this is the first factor. Unnecessary for a second factor.
 * @param {boolean} props.useTotpBackupCode - if true, show the UI for entering a backup code instead of
 *   for entering a code from the authenticator app.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterTotpCode = ({
  showEmailOrUsername = false,
  useTotpBackupCode = false,
  onEvent,
  allowBack,
  error,
}) => {
  const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);
  const [totpCodeError, setTotpCodeError] = useState(false);
  const [totpBackupCodeError, setTotpBackupCodeError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const elements = event.target.elements;

    // Enforce presence of emailOrUsername if visible
    if (showEmailOrUsername) {
      setEmailOrUsernameError(!elements.emailOrUsername.value);
      if (emailOrUsernameError) return;
    }

    // totpBackupCode
    if (useTotpBackupCode) {
      // Check that the backup code is present
      setTotpBackupCodeError(!elements.totpBackupCode.value);
      if (totpBackupCodeError) return;

      // Submit the backup code
      const eventData = {
        type: "submit",
        totpBackupCode: elements.totpBackupCode.value,
      };
      if (elements.emailOrUsername?.value) {
        eventData.emailOrUsername = elements.emailOrUsername.value;
      }
      onEvent(eventData);
    } else {
      // totpCode
      // Check that the totpCode is present
      setTotpCodeError(!elements.totpCode.value);
      if (totpCodeError) return;

      // Submit the totpCode
      const eventData = {
        type: "submit",
        totpCode: elements.totpCode.value,
      };
      if (event.target.elements.emailOrUsername?.value) {
        eventData.emailOrUsername = emailOrUsername.value;
      }
      onEvent(eventData);
    }
  };

  const handleUseTotpCode = (event) => {
    event.preventDefault();
    onEvent({
      type: "useTotpBackupCode",
      useTotpBackupCode: false,
    });
  };

  const handleUseBackupCode = (event) => {
    event.preventDefault();
    onEvent({
      type: "useTotpBackupCode",
      useTotpBackupCode: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      {showEmailOrUsername && (
        <div className="userfront-form-row">
          <Input.EmailOrUsername showError={emailOrUsernameError} />
        </div>
      )}
      {useTotpBackupCode ? (
        <div className="userfront-form-row">
          <Input.TotpBackupCode showError={totpBackupCodeError} />
        </div>
      ) : (
        <div className="userfront-form-row">
          <Input.TotpCode showError={totpCodeError} />
        </div>
      )}
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>

      {useTotpBackupCode ? (
        <AlternativeButton onClick={handleUseTotpCode}>
          Use a code from your authenticator app or device
        </AlternativeButton>
      ) : (
        <AlternativeButton onClick={handleUseBackupCode}>
          Use a backup code
        </AlternativeButton>
      )}
    </form>
  );
};

export default EnterTotpCode;
