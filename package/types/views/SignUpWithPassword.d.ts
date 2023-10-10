export default SignUpWithPassword;
/**
 * View to allow a user to sign up with a username/email and password
 *
 * @param {object} props
 * @param {boolean} props.collectUsername - if true, show a field for the user's username. Default false.
 * @param {boolean} props.requirePasswordConfirmation - if true, show a second password input,
 *  and require the passwords to match. Default false.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function SignUpWithPassword({
  onEvent,
  allowBack,
  collectUsername,
  requirePasswordConfirmation,
  error,
}: {
  collectUsername: boolean;
  requirePasswordConfirmation: boolean;
  allowBack: boolean;
}): import("react").JSX.Element;
