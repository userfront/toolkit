/**
 * A basic <input> with appropriate classes and error message.
 * Props are passed through to the underlying <input>
 *
 * @param {object} props
 * @property {string} label If present, display a <label> element above the input
 * @property {boolean} showError Whether to display the error message
 * @property {string} errorMessage The error message to display
 * @returns
 */
export default function BaseInput({
  label,
  showError = false,
  errorMessage = "Required field",
  ...props
} = {}) {
  return (
    <>
      {label && <label htmlFor={props.name}>{label}</label>}
      <input
        className={`userfront-input ${
          showError ? "userfront-input-error" : ""
        }`}
        {...props}
      />
      {showError && (
        <div className="userfront-input-error-message">{errorMessage}</div>
      )}
    </>
  );
}
