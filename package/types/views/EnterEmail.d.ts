export default EnterEmail;
/**
 * A view prompting the user to enter an email address,
 * to send a link or code to.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterEmail({
  onEvent,
  allowBack,
  error,
}: {
  allowBack: boolean;
}): import("react").JSX.Element;
