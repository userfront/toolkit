export default EnterBackupCode;
/**
 * View prompting user to enter a TOTP backup code.
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterBackupCode({
  onEvent,
  allowBack,
  error,
}: {
  allowBack: boolean;
}): import("react").JSX.Element;
