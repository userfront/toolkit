export default BackButton;
/**
 * A "Back" button that sends a back event when clicked.
 * Styled as a secondary button.
 * If no children are provided, contains the text "Back".
 * Additional props are passed through to the underlying <button>
 *
 * @param {props} props
 * @param {function} props.onEvent
 * @param {function} props.onClick
 * @param {Array} props.children
 * @returns
 */
declare function BackButton({
  onEvent,
  onClick,
  children,
  ...props
}: any): import("react").JSX.Element;
