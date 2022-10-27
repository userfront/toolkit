import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

const SignUpWithPassword = ({ onEvent, allowBack, error }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;
    if (onEvent) {
      onEvent({
        type: "submit",
        username: elements.username.value,
        email: elements.email.value,
        password: elements.password.value,
        confirmPassword: elements.confirmPassword.value,
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
        ></input>
      </div>
      <div className="uf-toolkit-form-row">
        <label htmlFor="confirmPassword">Confirm your password</label>
        <input
          className="uf-toolkit-input"
          type="password"
          name="confirmPassword"
        ></input>
      </div>
      <ErrorMessage error={error} />
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default SignUpWithPassword;
