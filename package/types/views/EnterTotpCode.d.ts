export default EnterTotpCode;
/**
 * A view prompting the user to enter their TOTP authenticator code,
 * or a backup code.
 *
 * @param {object} props
 * @param {boolean} props.showEmailOrUsername - if true, show an input for the user's email or username.
 *   Necessary if this is the first factor. Unnecessary for a second factor.
 * @param {boolean} props.useBackupCode - if true, show the UI for entering a backup code instead of
 *   for entering a code from the authenticator app.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterTotpCode({
  showEmailOrUsername,
  useBackupCode,
  onEvent,
  allowBack,
  error,
}: {
  showEmailOrUsername: boolean;
  useBackupCode: boolean;
  allowBack: boolean;
}): import("react").JSX.Element;
