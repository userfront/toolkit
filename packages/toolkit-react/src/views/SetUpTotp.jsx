import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";

const EnterTotpCode = ({ qrCode, onEvent, allowBack }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      totpCode: event.target.elements.totpCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <p>1. Scan this QR code with your authenticator app</p>
      <img src={qrCode} width="100px" height="100px" />
      <p>2. Enter the six-digit code from your authenticator app</p>
      <label htmlFor="totpCode">Six-digit code</label>
      <input type="tel" name="totpCode" />
      {allowBack && <BackButton onBack={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterTotpCode;