import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

const EnterEmail = ({ onEvent }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "SUBMIT",
      email: event.target.elements.email.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="email">Email address</label>
      <input type="email" name="email" />
      <BackButton onBack={onEvent} />
      <SubmitButton />
    </form>
  );
};

export default EnterEmail;
