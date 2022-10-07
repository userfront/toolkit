import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";

// TODO: handle passwords not matching
// TODO: handle empty fields

const SignUpWithPassword = ({ onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    const elements = event.target.elements;
    if (onSubmit) {
      onSubmit({
        username: elements.username.value,
        email: elements.email.value,
        password: elements.password.value,
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
      <BackButton />
      <SubmitButton />
    </form>
  );
};

export default SignUpWithPassword;
