import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const EnterEmail = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      email: event.target.elements.email.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="email">Email address</label>
      <input type="email" name="email" />
      <ErrorMessage error={error} />
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default EnterEmail;
