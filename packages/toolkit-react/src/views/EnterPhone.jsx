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
      <div className="uf-toolkit-form-row">
        <label htmlFor="phoneNumber">Mobile phone number</label>
        <input className="uf-toolkit-input" type="tel" name="phoneNumber" />
      </div>
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterPhone;
