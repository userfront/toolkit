import { Component } from "react";
import BaseInput from "./BaseInput";
import EmailInput from "./EmailInput";
import EmailOrUsernameInput from "./EmailOrUsernameInput";
import PasswordInput from "./PasswordInput";

/**
 * Use as <Input /> for BaseInput
 * Use as <Input.Email /> for EmailInput, etc.
 */
export default class Input extends Component {
  static Email = EmailInput;
  static EmailOrUsername = EmailOrUsernameInput;
  static Password = PasswordInput;

  render() {
    return BaseInput(this.props);
  }
}
