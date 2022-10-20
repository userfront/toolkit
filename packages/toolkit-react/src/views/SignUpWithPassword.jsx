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
    <form onSubmit={handleSubmit} className="uf-form">
      <label htmlFor="username">Username</label>
      <input type="text" name="username"></input>
      <label htmlFor="email">Email address</label>
      <input type="email" name="email"></input>
      <label htmlFor="password">Choose a password</label>
      <input type="password" name="password"></input>
      <label htmlFor="confirmPassword">Confirm your password</label>
      <input type="password" name="confirmPassword"></input>
      <ErrorMessage error={error} />
      {allowBack && <BackButton onEvent={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default SignUpWithPassword;
