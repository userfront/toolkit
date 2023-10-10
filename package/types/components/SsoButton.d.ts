export default SsoButton;
/**
 * A button for an SSO provider, with appropriate icon.
 * Emits the selectFactor event when clicked.
 *
 * @param {object} props
 * @param {string} props.provider - the SSO provider
 * @param {function} props.onEvent
 */
declare function SsoButton({
  provider,
  onEvent,
}: {
  provider: string;
  onEvent: Function;
}): import("react").JSX.Element;
