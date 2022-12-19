import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const SignUpWithPassword = ({
  onEvent,
  allowBack,
  requirePasswordConfirmation,
  error,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    // If password confirmation is not required, put the password in that field so validation passes
    const confirmPassword = requirePasswordConfirmation
      ? elements.confirmPassword.value
      : elements.password.value;
    if (onEvent) {
      onEvent({
        type: "submit",
        username: elements.username.value,
        email: elements.email.value,
        password: elements.password.value,
        confirmPassword,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <div className="uf-toolkit-form-row">
        <label htmlFor="username">Username</label>
        <input className="uf-toolkit-input" type="text" name="username"></input>
      </div>
      <div className="uf-toolkit-form-row">
        <label htmlFor="email">Email address</label>
        <input className="uf-toolkit-input" type="email" name="email"></input>
      </div>
      <div className="uf-toolkit-form-row">
        <label htmlFor="password">Choose a password</label>
        <input
          className="uf-toolkit-input"
          type="password"
          name="password"
          aria-describedby="uf-toolkit-password-rules"
        ></input>
        <span
          className="uf-toolkit-secondary-text"
          id="uf-toolkit-password-rules"
        >
          At least 16 characters OR at least 8 characters including a number and
          a letter.
        </span>
      </div>
      {requirePasswordConfirmation && (
        <div className="uf-toolkit-form-row">
          <label htmlFor="confirmPassword">Confirm your password</label>
          <input
            className="uf-toolkit-input"
            type="password"
            name="confirmPassword"
          ></input>
        </div>
      )}
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default SignUpWithPassword;
