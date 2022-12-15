import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";

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
    <form onSubmit={handleSubmit} className="uf-toolkit-form">
      <div className="uf-toolkit-form-row">
        <label htmlFor="email">Username or email address</label>
        <input
          className="uf-toolkit-input"
          type="text"
          name="emailOrUsername"
        ></input>
      </div>
      <div className="uf-toolkit-form-row">
        <label htmlFor="password">Password</label>
        <input
          className="uf-toolkit-input"
          type="password"
          name="password"
        ></input>
      </div>
      <ErrorMessage error={error} />
      <div className="uf-toolkit-button-row">
        {allowBack && <BackButton onEvent={onEvent} />}
        <SubmitButton />
      </div>
    </form>
  );
};

export default LogInWithPassword;
