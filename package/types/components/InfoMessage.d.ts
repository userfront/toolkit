export default InfoMessage;
/**
 * An informational message, with some formatting and appropriate ARIA role.
 * Should only be used for messages that appear as a result of user action.
 *
 * @param {object} props
 * @param {string} props.message - message to display
 * @returns
 */
declare function InfoMessage({
  message,
}: {
  message: string;
}): import("react").JSX.Element;
