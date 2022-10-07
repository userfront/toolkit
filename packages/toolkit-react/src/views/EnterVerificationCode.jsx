import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

const EnterVerificationCode = ({ state, onEvent }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "SUBMIT",
      verificationCode: event.target.elements.verificationCode.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="verificationCode">
        {state.event.label || "Enter code"}
      </label>
      <input type="tel" name="verificationCode" />
      <BackButton onBack={onEvent} />
      <SubmitButton />
    </form>
  );
};

export default EnterVerificationCode;
