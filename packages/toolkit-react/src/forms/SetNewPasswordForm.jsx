import { callUserfront } from "../services/userfront";
import SubmitButton from "../components/SubmitButton";
import ContinueButton from "../components/ContinueButton";
import ErrorMessage from "../components/ErrorMessage";
import SecuredByUserfront from "../components/SecuredByUserfront";
import { useState } from "react";
import { useSizeClass } from "../utils/hooks";

const SetNewPasswordForm = ({ shouldConfirmPassword = false }) => {
  const [containerRef, setContainerRef] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [title, setTitle] = useState("Set your new password");
  const [text, setText] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const sizeClass = useSizeClass(containerRef);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    const password = event.target.elements.password.value;
    // Only compare if we're asking users to confirm their password
    const confirmPassword = shouldConfirmPassword
      ? event.target.elements.confirmPassword.value
      : event.target.elements.password.value;
    if (password !== confirmPassword) {
      setError({
        message:
          "The passwords don't match. Please re-enter your new password.",
      });
      return;
    }
    try {
      const response = await callUserfront({
        method: "updatePassword",
        args: [{ password }],
      });
      setSuccess(true);
      setLoading(false);
      setTitle("New password set");
      setText(
        `Success! Your password has been changed. Click the button below to continue to the site.`
      );
      setRedirectUrl(response.redirectTo);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  return (
    <div
      ref={setContainerRef}
      className={`uf-toolkit uf-toolkit-container ${sizeClass}`}
    >
      <h2>{title}</h2>
      <p>{text}</p>
      {!success && (
        <form onSubmit={handleSubmit} className="uf-toolkit-form">
          <div className="uf-toolkit-form-row">
            <label htmlFor="password">Choose a new password</label>
            <input
              className="uf-toolkit-input"
              type="password"
              name="password"
            ></input>
          </div>
          {shouldConfirmPassword && (
            <div className="uf-toolkit-form-row">
              <label htmlFor="confirmPassword">Confirm your new password</label>
              <input
                className="uf-toolkit-input"
                type="password"
                name="confirmPassword"
              ></input>
            </div>
          )}
          <ErrorMessage error={error} />
          <div className="uf-toolkit-button-row">
            <SubmitButton />
          </div>
        </form>
      )}
      {success && (
        <a href={redirectUrl}>
          <ContinueButton />
        </a>
      )}
      <div>
        <SecuredByUserfront />
      </div>
    </div>
  );
};

export default SetNewPasswordForm;
