/**
 * Use as <Input /> for BaseInput
 * Use as <Input.Email /> for EmailInput, etc.
 */
export default class Input extends Component<any, any, any> {
  static Email: typeof EmailInput;
  static EmailOrUsername: typeof EmailOrUsernameInput;
  static Password: typeof PasswordInput;
  static TotpCode: typeof TotpCodeInput;
  static BackupCode: typeof BackupCodeInput;
  static VerificationCode: typeof VerificationCodeInput;
  constructor(props: any);
  constructor(props: any, context: any);
  render(): import("react").JSX.Element;
}
import { Component } from "react";
import EmailInput from "./EmailInput";
import EmailOrUsernameInput from "./EmailOrUsernameInput";
import PasswordInput from "./PasswordInput";
import TotpCodeInput from "./TotpCodeInput";
import BackupCodeInput from "./BackupCodeInput";
import VerificationCodeInput from "./VerificationCodeInput";
