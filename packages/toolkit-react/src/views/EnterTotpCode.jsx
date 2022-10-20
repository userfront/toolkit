import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";

const EnterTotpCode = ({ onEvent }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      totpCode: event.target.elements.totpCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="totpCode">
        Six-digit code from authenticator app or device
      </label>
      <input type="tel" name="totpCode" />
      <AlternativeButton>Use a backup code (TODO)</AlternativeButton>
      <BackButton onBack={onEvent} />
      <SubmitButton />
    </form>
  );
};

export default EnterTotpCode;
