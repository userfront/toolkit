export default SetUpTotpSuccess;
/**
 * View to confirm that the TOTP factor was successfully set up,
 * and to display backup codes so the user can record them.
 *
 * @param {object} props
 * @param {array} props.backupCodes - array of strings
 * @param {function} onEvent
 */
declare function SetUpTotpSuccess({
  backupCodes,
  onEvent,
}: {
  backupCodes: any[];
}): import("react").JSX.Element;
