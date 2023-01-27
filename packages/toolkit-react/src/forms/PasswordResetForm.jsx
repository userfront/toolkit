import { callUserfront } from "../services/userfront";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import SecuredByUserfront from "../components/SecuredByUserfront";
import { useState } from "react";
import { useSizeClass } from "../utils/hooks";

/**
 * Form to request a password reset email.
 */
const PasswordResetForm = () => {
  // Apply a size-based CSS class based on the container's size
  const [containerRef, setContainerRef] = useState();
  const sizeClass = useSizeClass(containerRef);

  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [success, setSuccess] = useState();
  const [title, setTitle] = useState("Password reset");
  const [text, setText] = useState(
    "We'll email you a link to reset your password"
  );

  // Try to request a password reset email.
  // Display a success message if successful.
  // Otherwise, display the error received from the server.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const email = event.target.elements.email.value;
      const response = await callUserfront({
        method: "sendResetLink",
        args: [email],
      });
      setSuccess(true);
      setLoading(false);
      setTitle("Check your email");
      setText(
        `We sent an email to ${response.result.email} with a link to reset your password.`
      );
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  return (
    <div
      ref={setContainerRef}
      className={`userfront-toolkit userfront-container ${sizeClass}`}
    >
      <h2>{title}</h2>
      <p>{text}</p>
      {!success && (
        <form onSubmit={handleSubmit} className="userfront-form">
          <div className="userfront-form-row">
            <label htmlFor="email">Email address</label>
            <input className="userfront-input" type="email" name="email" />
          </div>
          <ErrorMessage error={error} />
          <div className="userfront-button-row">
            <SubmitButton disabled={loading}>Get reset link</SubmitButton>
          </div>
        </form>
      )}
      <div>
        <SecuredByUserfront />
      </div>
    </div>
  );
};

export default PasswordResetForm;
