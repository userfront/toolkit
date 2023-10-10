export default EmailLinkSent;
/**
 * View confirming that a link was sent to the user's email.
 * @param {object} props
 * @param {object} props.user
 * @param {string} props.user.email - the email a link was sent to
 * @param {string} message - info message to display on later user action, i.e. "email resent"
 * @param {function} onEvent
 * @returns
 */
declare function EmailLinkSent({
  onEvent,
  user,
  message,
}: {
  user: {
    email: string;
  };
}): import("react").JSX.Element;
