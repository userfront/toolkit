import { useState } from "react";

/**
 * An <input> with toggle to show / hide the password
 *
 * @param {object} props
 * @returns
 */
const PasswordInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <span className="userfront-password-input-container">
      <input
        className="userfront-input"
        type={showPassword ? "text" : "password"}
        name="password"
        aria-describedby="userfront-password-rules"
        {...props}
      />
      <div
        className="userfront-password-toggle"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? "hide" : "show"}
      </div>
    </span>
  );
};

export default PasswordInput;
