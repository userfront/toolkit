import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const EnterBackupCode = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <div className="uf-toolkit-form-row">
        <label htmlFor="totpCode">Backup code</label>
        <input className="uf-toolkit-input" type="tel" name="totpCode" />
      </div>
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterBackupCode;
