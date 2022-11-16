import { LogoutButton } from "toolkit-react";
import { Link } from "react-router-dom";

const LogoutDemo = () => {
  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <LogoutButton />
      <hr />
      <div>
        <p>Logout button does not have state.</p>
      </div>
    </div>
  );
};
export default LogoutDemo;
