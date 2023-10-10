export default SubmitButton;
/**
 * A submit button with appropriate styling.
 * If no children are provided, contains the text "Submit".
 * Props are passed through to the underlying <button>.
 *
 * @param {object} props
 * @returns
 */
declare function SubmitButton({
  children,
  ...props
}: object): import("react").JSX.Element;
