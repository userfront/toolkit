import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/signup">Signup form demo</Link>
        </li>
        <li>
          <Link to="/login">Login form demo</Link>
        </li>
        <li>
          <Link to="/reset">Password reset form demo</Link>
        </li>
        <li>
          <Link to="/logout">Logout button demo</Link>
        </li>
      </ul>
    </div>
  );
};

export default Index;
