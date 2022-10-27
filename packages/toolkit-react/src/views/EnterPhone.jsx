import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const EnterPhone = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      phoneNumber: event.target.elements.phoneNumber.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <label htmlFor="phoneNumber">Mobile phone number</label>
      <input className="uf-toolkit-input" type="tel" name="phoneNumber" />
      <ErrorMessage error={error} />
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterPhone;
