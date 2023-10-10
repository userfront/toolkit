export default SetNewPassword;
declare function SetNewPassword({
  onEvent,
  requireExistingPassword,
  requirePasswordConfirmation,
  error,
}: {
  onEvent: any;
  requireExistingPassword?: boolean;
  requirePasswordConfirmation?: boolean;
  error: any;
}): import("react").JSX.Element;
