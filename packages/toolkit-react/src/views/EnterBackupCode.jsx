import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

const EnterBackupCode = ({ onEvent, allowBack }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="totpCode">Backup code</label>
      <input type="tel" name="totpCode" />
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterBackupCode;
