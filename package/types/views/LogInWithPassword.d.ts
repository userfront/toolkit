export default LogInWithPassword;
/**
 * A view prompting the user for their username/email and password.
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function LogInWithPassword({
  onEvent,
  allowBack,
  error,
}: {
  allowBack: boolean;
}): import("react").JSX.Element;
