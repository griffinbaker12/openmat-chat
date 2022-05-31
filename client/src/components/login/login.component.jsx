import './login.styles.scss';

const Login = () => {
  return (
    <article className="login-article">
      <main className="login-main">
        <div className="login-measure">
          <fieldset className="login-fieldset">
            <legend className="login-legend">Sign In</legend>
            <div className="login-legend-input-container">
              <label for="email-address" className="login-legend-label">
                Email
              </label>
              <input
                className="login-legend-input"
                type="email"
                name="email-address"
                id="email-address"
              />
            </div>
            <div className="login-legend-input-container">
              <label for="email-address" className="login-legend-label">
                Password
              </label>
              <input
                className="login-legend-input"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </fieldset>
          <input className="login-input" value="Sign In" type="submit" />
          <p className="register-text">Register</p>
        </div>
      </main>
    </article>
  );
};

export default Login;
