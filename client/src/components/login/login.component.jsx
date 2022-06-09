import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import Spinner from '../spinner/spinner.component';
import { toast } from 'react-toastify';
import './login.styles.scss';

const Login = () => {
  const [text, setText] = useState({ emailOrUserName: '', password: '' });

  const { changeAuth, setCurrentUser, isLoading, setIsLoading } =
    useAuthentication();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!text.emailOrUserName) {
      toast.error('Please enter all fields', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
    setIsLoading(true);
    fetch('http://localhost:4000/api/user/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrUserName: text.emailOrUserName,
        password: text.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
        // Until we and if we use redux with the persisted state, but otherwise we can just check to see if there is a current user
        localStorage.setItem('userInfo', JSON.stringify(data));
        setIsLoading(false);
        navigate('/chat');
        toast.success('Login success', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch(err => {
        setIsLoading(false);
        toast.error('Invalid user credentials', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      });

    // Definitely room here as well for showing a toast icon that will pop up when the user either is or is not successful in signing up and for what reason. For that reason alone and how clean it is it makes me want to use chakra ui.

    // Same idea here, instead of an alert window, could just render a nice and clean toast icon that will either be on or off depending on the state that you can pass it as a property
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
              <label htmlFor="emailOrUserName" className="login-legend-label">
                Email / Username
              </label>
              <input
                onChange={handleChange}
                className="login-legend-input"
                type="text"
                name="emailOrUserName"
                id="emailOrUserName"
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
          <button className="login-input" type="button" onClick={handleLogin}>
            {isLoading ? <Spinner /> : 'Sign In'}
          </button>
          <p onClick={changeAuth} className="register-text">
            Register
          </p>
        </div>
      </main>
    </article>
  );
};

export default Login;
