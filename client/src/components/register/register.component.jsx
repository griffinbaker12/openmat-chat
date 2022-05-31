import { useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import './register.styles.scss';

const Register = () => {
  const { changeAuth } = useAuthentication();

  const [text, setText] = useState({ name: '', email: '', password: '' });

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
                onChange={handleChange}
                className="register-legend-input"
                type="text"
                name="name"
                id="name"
                required
              />
            </div>
            <div className="register-legend-input-container">
              <label htmlFor="email" className="register-legend-label">
                Email
              </label>
              <input
                onChange={handleChange}
                className="register-legend-input"
                type="email"
                name="email"
                id="email"
                required
              />
            </div>
            <div className="register-legend-input-container">
              <label htmlFor="password" className="register-legend-label">
                Password
              </label>
              <input
                onChange={handleChange}
                className="register-legend-input"
                type="password"
                name="password"
                id="password"
                required
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
