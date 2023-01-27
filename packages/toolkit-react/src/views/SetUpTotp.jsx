import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * View for the user to set up their TOTP authenticator.
 *
 * @param {object} props
 * @param {string} props.qrCode - QR code to display. Image URL or data-url.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
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
      <form onSubmit={handleSubmit} className="userfront-form">
        <div className="userfront-form-row">
          <label htmlFor="totpCode">Six-digit code</label>
          <input className="userfront-input" type="tel" name="totpCode" />
        </div>
        <ErrorMessage error={error} />
        <div className="userfront-button-row">
          {allowBack && <BackButton onEvent={onEvent} />}
          <SubmitButton />
        </div>
      </form>
    </>
  );
};

export default EnterTotpCode;
