import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";

const EnterTotpCode = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      totpCode: event.target.elements.totpCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <label htmlFor="totpCode">
        Six-digit code from authenticator app or device
      </label>
      <input className="uf-toolkit-input" type="tel" name="totpCode" />
      <ErrorMessage error={error} />
      <AlternativeButton>Use a backup code (TODO)</AlternativeButton>
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterTotpCode;
