import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import AlternativeButton from "../components/AlternativeButton";
import ErrorMessage from "../components/ErrorMessage";

const EnterTotpCode = ({ qrCode, onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      totpCode: event.target.elements.totpCode.value,
    });
  };

  return (
    <>
      <p>1. Scan this QR code with your authenticator app</p>
      <img src={qrCode} width="100px" height="100px" />
      <p>2. Enter the six-digit code from your authenticator app</p>
      <form onSubmit={handleSubmit} className="uf-toolkit-form">
        <label htmlFor="totpCode">Six-digit code</label>
        <input className="uf-toolkit-input" type="tel" name="totpCode" />
        <ErrorMessage error={error} />
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </form>
    </>
  );
};

export default EnterTotpCode;
