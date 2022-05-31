import { useAuthentication } from '../../contexts/authentication-context';
import './register.styles.scss';

const Register = () => {
  const { changeAuth } = useAuthentication();

  return (
    <article className="register-article">
      <main className="register-main">
        <div className="register-measure">
          <fieldset className="register-fieldset">
            <legend className="register-legend">Register</legend>
            <div className="register-legend-input-container">
              <label htmlFor="name" className="register-legend-label">
                Name
              </label>
              <input
                className="register-legend-input"
                type="text"
                name="name"
                id="name"
              />
            </div>
            <div className="register-legend-input-container">
              <label htmlFor="email-address" className="register-legend-label">
                Email
              </label>
              <input
                className="register-legend-input"
                type="email"
                name="email-address"
                id="email-address"
              />
            </div>
            <div className="register-legend-input-container">
              <label htmlFor="password" className="register-legend-label">
                Password
              </label>
              <input
                className="register-legend-input"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </fieldset>
          <input className="register-input" value="Sign In" type="submit" />
          <p onClick={changeAuth} className="sign-in-text">
            Back to Sign In
          </p>
        </div>
      </main>
    </article>
  );
};

export default Register;
