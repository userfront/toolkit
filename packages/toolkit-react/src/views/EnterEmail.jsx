import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * A view prompting the user to enter an email address,
 * to send a link or code to.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const EnterEmail = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onEvent({
      type: "submit",
      email: event.target.elements.email.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <div className="uf-toolkit-form-row">
        <label htmlFor="email">Email address</label>
        <input className="uf-toolkit-input" type="email" name="email" />
      </div>
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default EnterEmail;
