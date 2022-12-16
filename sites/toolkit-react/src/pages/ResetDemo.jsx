import { PasswordResetForm } from "../../../../packages/toolkit-react/src/index.js";
import { Link } from "react-router-dom";
import { useMockUserfront } from "../hooks.js";

const ResetDemo = () => {
  useMockUserfront();
  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <PasswordResetForm />
      <hr />
      <div>
        <p>Password reset form has only internal state.</p>
      </div>
    </div>
  );
};

export default ResetDemo;
