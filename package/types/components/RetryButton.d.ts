export default RetryButton;
/**
 * A retry button, with subtle styling.
 * If no children are passed, contains the text "Retry".
 * Props are passed through to the underlying <button>.
 *
 * @param {object} props
 * @returns
 */
declare function RetryButton({
  children,
  ...props
}: object): import("react").JSX.Element;
