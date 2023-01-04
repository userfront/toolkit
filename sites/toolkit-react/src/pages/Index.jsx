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
          <Link to="/reset">Password reset form demo</Link>
        </li>
        <li>
          <Link to="/set-password">Set new password form demo</Link>
        </li>
        <li>
          <Link to="/logout">Logout button demo</Link>
        </li>
      </ul>
      <h2>Live demos</h2>
      <p>
        Connected to live tenant "Toolkit Test Tenant" <code>6bg66q7n</code>{" "}
        with the domain <code>https://toolkit-dev-app-react.vercel.app/</code>{" "}
        set as a live domain.
      </p>
      <ul>
        <li>
          <Link to="/live/signup">Signup form (live)</Link>
        </li>
        <li>
          <Link to="/live/login">Login form (live)</Link>
        </li>
        <li>
          <Link to="/live/reset">Password reset form (live)</Link>
        </li>
        <li>
          <Link to="/redirects/password-reset">
            Set new password form (live)
          </Link>
          <ul>
            <li>
              At the password reset path. For full flow, use the password reset
              form, then follow the link there.
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
