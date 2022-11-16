import { LogoutButton } from "toolkit-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LogoutDemo = () => {
  const [disabled, setDisabled] = useState(false);
  const toggleDisabled = () => setDisabled(!disabled);
  return (
    <div className="App">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div style={{ width: "300px", margin: "0 auto" }}>
        <LogoutButton disabled={disabled} />
      </div>
      <hr />
      <div>
        <p>Logout button does not have state.</p>
        <button onClick={toggleDisabled}>Toggle disabled</button>
      </div>
    </div>
  );
};
export default LogoutDemo;
