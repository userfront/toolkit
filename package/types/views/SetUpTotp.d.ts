export default EnterTotpCode;
/**
 * View for the user to set up their TOTP authenticator.
 *
 * @param {object} props
 * @param {string} props.qrCode - QR code to display. Image URL or data-url.
 * @param {boolean} props.allowBack - if true, show a Back button
 * @param {object} error - a Userfront error to display
 * @param {function} onEvent
 */
declare function EnterTotpCode({
  qrCode,
  onEvent,
  allowBack,
  error,
}: {
  qrCode: string;
  allowBack: boolean;
}): import("react").JSX.Element;
