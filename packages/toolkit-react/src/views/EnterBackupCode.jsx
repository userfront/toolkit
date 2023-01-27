import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * View prompting user to enter a TOTP backup code.
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterBackupCode = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      <div className="userfront-form-row">
        <label htmlFor="totpCode">Backup code</label>
        <input className="userfront-input" type="tel" name="totpCode" />
      </div>
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterBackupCode;
