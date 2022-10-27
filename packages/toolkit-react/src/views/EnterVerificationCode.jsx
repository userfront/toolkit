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
      <div className="uf-toolkit-form-row">
        <label htmlFor="verificationCode">"Enter your code"</label>
        <input
          className="uf-toolkit-input"
          type="tel"
          name="verificationCode"
        />
      </div>
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        <BackButton onEvent={onEvent} />
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterVerificationCode;
