import { useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import './login.styles.scss';

const Login = () => {
  const { changeAuth } = useAuthentication();

  const [text, setText] = useState({ email: '', password: '' });

  const handleChange = e => {
    const name = e.target.getAttribute('name');
    setText(prevState => {
      return {
        ...prevState,
        [name]: e.target.value,
      };
    });
  };

  return (
    <article className="login-article">
      <main className="login-main">
        <div className="login-measure">
          <fieldset className="login-fieldset">
            <legend className="login-legend">Sign In</legend>
            <div className="login-legend-input-container">
              <label htmlFor="email" className="login-legend-label">
                Email
              </label>
              <input
                onChange={handleChange}
                className="login-legend-input"
                type="email"
                name="email"
                id="email"
                value={text.email}
                required
              />
            </div>
            <div className="login-legend-input-container">
              <label htmlFor="password" className="login-legend-label">
                Password
              </label>
              <input
                onChange={handleChange}
                className="login-legend-input"
                type="password"
                name="password"
                id="password"
                value={text.password}
                required
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
