import { useAuthentication } from '../../contexts/authentication-context';
import './login.styles.scss';

const Login = () => {
  const { changeAuth } = useAuthentication();

  return (
    <article className="login-article">
      <main className="login-main">
        <div className="login-measure">
          <fieldset className="login-fieldset">
            <legend className="login-legend">Sign In</legend>
            <div className="login-legend-input-container">
              <label htmlFor="email-address" className="login-legend-label">
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
              <label htmlFor="password" className="login-legend-label">
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
          <p onClick={changeAuth} className="register-text">
            Register
          </p>
        </div>
      </main>
    </article>
  );
};

export default Login;
