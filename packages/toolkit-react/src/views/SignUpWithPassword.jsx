import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

// TODO: handle passwords not matching
// TODO: handle empty fields

const SignUpWithPassword = ({ onEvent, allowBack }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
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
      {allowBack && <BackButton onBack={onEvent} />}
      <SubmitButton />
    </form>
  );
};

export default SignUpWithPassword;
