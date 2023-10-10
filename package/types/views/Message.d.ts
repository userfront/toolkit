export default Message;
/**
 * Just a message. Only used in development scenarios.
 *
 * @param {object} props
 * @param {string} props.text
 */
declare function Message({
  text,
}: {
  text: string;
}): import("react").JSX.Element;
