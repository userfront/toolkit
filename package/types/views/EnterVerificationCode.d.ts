export default EnterVerificationCode;
/**
 * A view prompting the user to enter the verification code they received by email or SMS.
 *
 * @param {object} props
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterVerificationCode({
  onEvent,
  error,
}: object): import("react").JSX.Element;
