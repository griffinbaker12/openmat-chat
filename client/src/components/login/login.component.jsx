import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import './login.styles.scss';

const Login = () => {
  const { changeAuth } = useAuthentication();
  const navigate = useNavigate();
  const [text, setText] = useState({ email: '', password: '' });

  const handleRegistration = () => {
    fetch('http://localhost:4000/api/user/', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: text.email,
        password: text.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
        // Until we and if we use redux with the persisted state, but otherwise we can just check to see if there is a current user
        localStorage.setItem('userInfo', JSON.stringify(data));
      })
      .catch(err => console.log(err));

    navigate('/chat');
    // Definitely room here as well for showing a toast icon that will pop up when the user either is or is not successful in signing up and for what reason. For that reason alone and how clean it is it makes me want to use chakra ui.
  };

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
