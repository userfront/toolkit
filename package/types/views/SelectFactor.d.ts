export default SelectFactor;
/**
 * A view prompting the user to select a factor. May also include the
 * password view inline.
 *
 * @param {object} props
 * @param {object} props.flow - the auth flow in use
 * @param {boolean} props.isCompact - if true, show a "Username and password" button to
 *   open the password view. If false, show the password view inline. Default false.
 * @param {array} props.allowedSecondFactors - which second factors are allowed, if this is the second factor.
 * @param {boolean} props.isSecondFactor - if true, use allowedSecondFactors. If false, use flow.firstFactors.
 * @param {boolean} props.isLogin - if true, this is a login form; if false, this is a signup form. Default false.
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function SelectFactor({
  flow,
  isCompact,
  onEvent,
  allowedSecondFactors,
  isSecondFactor,
  isLogin,
  error,
}: {
  flow: object;
  isCompact: boolean;
  allowedSecondFactors: any[];
  isSecondFactor: boolean;
  isLogin: boolean;
}): import("react").JSX.Element;
