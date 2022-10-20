import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

const EnterPhone = ({ onEvent, allowBack }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      phoneNumber: event.target.elements.phoneNumber.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="phoneNumber">Mobile phone number</label>
      <input type="tel" name="phoneNumber" />
      {allowBack && <BackButton onBack={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterPhone;
