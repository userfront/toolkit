import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

const EnterVerificationCode = ({ onEvent }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      verificationCode: event.target.elements.verificationCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="verificationCode">"Enter your code"</label>
      <input type="tel" name="verificationCode" />
      <BackButton onBack={onEvent} />
      <SubmitButton />
    </form>
  );
};

export default EnterVerificationCode;
