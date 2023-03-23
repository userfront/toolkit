import { Component } from "react";
import BaseInput from "./BaseInput";
import EmailInput from "./EmailInput";
import EmailOrUsernameInput from "./EmailOrUsernameInput";
import PasswordInput from "./PasswordInput";
import TotpCodeInput from "./TotpCodeInput";
import TotpBackupCodeInput from "./TotpBackupCodeInput";
import VerificationCodeInput from "./VerificationCodeInput";

/**
 * Use as <Input /> for BaseInput
 * Use as <Input.Email /> for EmailInput, etc.
 */
export default class Input extends Component {
  static Email = EmailInput;
  static EmailOrUsername = EmailOrUsernameInput;
  static Password = PasswordInput;
  static TotpCode = TotpCodeInput;
  static TotpBackupCode = TotpBackupCodeInput;
  static VerificationCode = VerificationCodeInput;

  render() {
    return BaseInput(this.props);
  }
}
