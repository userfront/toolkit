import { Link } from "react-router-dom";

function clearCookies() {
  document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, (name) =>
    location.hostname
      .split(/\.(?=[^\.]+\.)/)
      .reduceRight(
        (acc, val, i, arr) =>
          i ? (arr[i] = "." + val + acc) : ((arr[i] = ""), arr),
        ""
      )
      .map(
        (domain) =>
          (document.cookie = `${name}=;max-age=0;path=/;domain=${domain}`)
      )
  );
}

const Index = () => {
  return (
    <div>
      <h2>Non-live demos</h2>
      <ul>
        <li>
          <Link to="/signup">Signup form demo</Link>
        </li>
        <li>
          <Link to="/login">Login form demo</Link>
        </li>
        <li>
          <Link to="/reset">Password reset form demo (universal)</Link>
        </li>
        <li>
          <Link to="/logout">Logout button demo</Link>
        </li>
      </ul>
      <h2>Live demos</h2>
      <p>
        Connected to live tenant "Toolkit Test Tenant" <code>wbm95g4b</code>{" "}
        with the domain <code>https://toolkit-dev-app-react.vercel.app/</code>{" "}
        set as a live domain.
      </p>
      <ul>
        <li>
          <Link to="/live/signup">Signup form (live)</Link>
          <ul>
            <li>
              <Link to="/live/signup?redirectOnLoad=true">
                (with redirect on load for logged-in users)
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/live/login">Login form (live)</Link>
          <ul>
            <li>
              <Link to="/live/login?redirectOnLoad=true">
                (with redirect on load for logged-in users)
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/live/reset">Password reset form (live)</Link>
          <ul>
            <li>
              Should display the "request password reset" form when accessed
              directly, and the "set new password" form when provided{" "}
              <code>uuid</code> and
              <code>token</code> in the query parameters. For the full flow,
              copy the query params from the link you receive and paste them
              into the password reset form page's URL.
            </li>
          </ul>
        </li>
        <li>
          <Link to="/live/logout">Logout button (live)</Link>
        </li>
      </ul>
      <p>
        <button onClick={clearCookies}>Clear all cookies</button>
      </p>
    </div>
  );
};

export default Index;
