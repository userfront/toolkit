/**
 * A retry button, with subtle styling.
 * If no children are passed, contains the text "Retry".
 * Props are passed through to the underlying <button>.
 *
 * @param {object} props
 * @returns
 */
const RetryButton = ({ children, onClick, ...props }) => {
  const message = children || "Retry";
  return (
    <button className="uf-toolkit-button uf-toolkit-button-subtle" {...props}>
      {message}
    </button>
  );
};

export default RetryButton;
