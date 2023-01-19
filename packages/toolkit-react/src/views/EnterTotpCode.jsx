import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * A view prompting the user to enter their TOTP authenticator code,
 * or a backup code.
 *
 * @param {object} props
 * @param {boolean} props.showEmailOrUsername - if true, show an input for the user's email or username.
 *   Necessary if this is the first factor. Unnecessary for a second factor.
 * @param {boolean} props.useBackupCode - if true, show the UI for entering a backup code instead of
 *   for entering a code from the authenticator app.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterTotpCode = ({
  showEmailOrUsername = false,
  useBackupCode = false,
  onEvent,
  allowBack,
  error,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (useBackupCode) {
      const eventData = {
        type: "submit",
        backupCode: event.target.elements.backupCode.value,
      };
      if (event.target.elements.emailOrUsername?.value) {
        eventData.emailOrUsername = event.target.elements.emailOrUsername.value;
      }
      onEvent(eventData);
    } else {
      const eventData = {
        type: "submit",
        totpCode: event.target.elements.totpCode.value,
      };
      if (event.target.elements.emailOrUsername?.value) {
        eventData.emailOrUsername = event.target.elements.emailOrUsername.value;
      }
      onEvent(eventData);
    }
  };

  const handleUseTotpCode = (event) => {
    event.preventDefault();
    onEvent({
      type: "useBackupCode",
      useBackupCode: false,
    });
  };

  const handleUseBackupCode = (event) => {
    event.preventDefault();
    onEvent({
      type: "useBackupCode",
      useBackupCode: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      {showEmailOrUsername && (
        <div className="uf-toolkit-form-row">
          <label htmlFor="emailOrUsername">Username or email address</label>
          <input
            className="uf-toolkit-input"
            type="text"
            name="emailOrUsername"
          />
        </div>
      )}
      {useBackupCode ? (
        <div className="uf-toolkit-form-row">
          <label htmlFor="backupCode">Backup code</label>
          <input className="uf-toolkit-input" type="tel" name="backupCode" />
        </div>
      ) : (
        <div className="uf-toolkit-form-row">
          <label htmlFor="totpCode">
            Six-digit code from your authenticator app or device
          </label>
          <input className="uf-toolkit-input" type="tel" name="totpCode" />
        </div>
      )}
      {useBackupCode ? (
        <AlternativeButton onClick={handleUseTotpCode}>
          Use a code from your authenticator app or device
        </AlternativeButton>
      ) : (
        <AlternativeButton onClick={handleUseBackupCode}>
          Use a backup code
        </AlternativeButton>
      )}
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterTotpCode;
