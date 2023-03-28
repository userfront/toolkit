import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import BaseInput from "./BaseInput";

/**
 * An <input> with toggle to show / hide the password
 *
 * @param {object} props
 * @returns
 */
export default function PasswordInput({
  label = "Password",
  showError,
  errorMessage = "Please enter your password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <>
      <label htmlFor="password">{label}</label>
      <span className="userfront-password-input-container">
        <BaseInput
          type={showPassword ? "text" : "password"}
          name="password"
          aria-describedby="userfront-password-rules"
          showError={showError}
          errorMessage={errorMessage}
          {...props}
        />
        <div
          className="userfront-password-toggle"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash size="15px" /> : <FaEye size="15px" />}
        </div>
      </span>
    </>
  );
}
