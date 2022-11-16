import { PasswordResetForm } from "toolkit-react";
import { Link } from "react-router-dom";

const ResetDemo = () => {
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
