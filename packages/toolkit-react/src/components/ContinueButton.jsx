/**
 * A primary-styled button that says "Continue"
 * Props are passed through to the underlying <button>
 *
 * @param {object} props
 */
const ContinueButton = (props) => {
  return (
    <button
      className="uf-toolkit-button uf-toolkit-button-primary"
      type="submit"
      {...props}
    >
      Continue
    </button>
  );
};

export default ContinueButton;
