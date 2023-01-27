import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

/**
 * A view prompting the user for their username/email and password.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const LogInWithPassword = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    if (onEvent) {
      onEvent({
        type: "submit",
        emailOrUsername: elements.emailOrUsername.value,
        password: elements.password.value,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="userfront-form">
      <div className="userfront-form-row">
        <label htmlFor="email">Username or email address</label>
        <input
          className="userfront-input"
          type="text"
          name="emailOrUsername"
        ></input>
      </div>
      <div className="userfront-form-row">
        <label htmlFor="password">Password</label>
        <input
          className="userfront-input"
          type="password"
          name="password"
          aria-describedby="userfront-password-rules"
        ></input>
        <span
          className="userfront-secondary-text"
          id="userfront-password-rules"
        >
          At least 16 characters OR at least 8 characters including a number and
          a letter.
        </span>
      </div>
      <ErrorMessage error={error} />
      <div className="userfront-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default LogInWithPassword;
