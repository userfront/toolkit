import { SetNewPasswordForm } from "../../../../packages/toolkit-react/src/index.js";
import { Link } from "react-router-dom";
import { useDisableGlobalUserfront } from "../hooks.js";

const ResetDemo = () => {
  useDisableGlobalUserfront();
  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <SetNewPasswordForm />
      <hr />
      <div>
        <p>Form to set new password has only internal state.</p>
      </div>
    </div>
  );
};

export default ResetDemo;