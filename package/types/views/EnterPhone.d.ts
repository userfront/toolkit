export default EnterPhone;
/**
 * A view prompting the user to enter a phone number to send a code to.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterPhone({
  onEvent,
  allowBack,
  error,
}: {
  allowBack: boolean;
}): import("react").JSX.Element;
