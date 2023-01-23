import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * A view prompting the user to enter the verification code they received by email or SMS.
 *
 * @param {object} props
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterVerificationCode = ({ onEvent, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      verificationCode: event.target.elements.verificationCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      <div className="userfront-form-row">
        <label htmlFor="verificationCode">Enter your code</label>
        <input className="userfront-input" type="tel" name="verificationCode" />
      </div>
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        <BackButton onEvent={onEvent} />
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterVerificationCode;
