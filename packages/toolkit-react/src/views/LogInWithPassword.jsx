import { useState } from "react";
import SubmitButton from "../components/SubmitButton";
import BackButton from "../components/BackButton";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";

/**
 * A view prompting the user for their username/email and password.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
const LogInWithPassword = ({ onEvent, allowBack, error }) => {
  const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const elements = event.target.elements;

    // Enforce presence of emailOrUsername & password
    setEmailOrUsernameError(!elements.emailOrUsername.value);
    setPasswordError(!elements.password.value);
    if (!elements.emailOrUsername.value || !elements.password.value) return;

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
        <Input.EmailOrUsername showError={emailOrUsernameError} />
      </div>
      <div className="userfront-form-row">
        <Input.Password showError={passwordError} />
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
