import { Link } from "react-router-dom";

function Redirect({ type }) {
  return (
    <div>
      <h1>Redirect: {type}</h1>
      <Link to="/">Home</Link>
    </div>
  );
}

export default Redirect;
