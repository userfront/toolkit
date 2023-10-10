export default TotpErrorMessage;
/**
 * An error message specifically for cases where we encounter an error
 * when trying to get the TOTP setup information (QR code).
 *
 * @param {object} props
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function TotpErrorMessage({
  onEvent,
  allowBack,
  error,
}: {
  allowBack: boolean;
}): import("react").JSX.Element;
