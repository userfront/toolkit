import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const EnterVerificationCode = ({ onEvent, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      verificationCode: event.target.elements.verificationCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <label htmlFor="verificationCode">"Enter your code"</label>
      <input className="uf-toolkit-input" type="tel" name="verificationCode" />
      <ErrorMessage error={error} />
      <BackButton onEvent={onEvent} />
      <SubmitButton />
    </form>
  );
};

export default EnterVerificationCode;
