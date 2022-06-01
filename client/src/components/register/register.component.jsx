import { useRef, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import './register.styles.scss';

const Register = () => {
  const hiddenInputRef = useRef();
  const [fileText, setFileText] = useState('No file chosen, yet');
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

  const handleFileInputChange = e => {
    if (hiddenInputRef.current.value) {
      setFileText(hiddenInputRef.current.value);
    } else {
      setFileText('No file chosen, yet');
    }
  };

  const handleImageUpload = () => {
    // Simulate a click on hidden button
    hiddenInputRef.current.click();
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
                value={text.name}
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
                value={text.email}
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
                value={text.password}
              />
            </div>
            <div className="register-legend-input-container-file">
              {/* <label htmlFor="picture" className="register-legend-label-file">
                Profile Picture
                <input
                  onChange={handleImageUpload}
                  className="register-legend-input-file"
                  type="file"
                  accept="image/*"
                  id="picture"
                />
              </label> */}
              <input
                ref={hiddenInputRef}
                type="file"
                id="profile-picture"
                onChange={handleFileInputChange}
                hidden
              />
              <button
                onClick={handleImageUpload}
                type="button"
                id="profile-picture-button"
              >
                Select Profile Picture Image
              </button>
              <div className="profile-picture-text-container">
                <span id="profile-picture-text">{fileText}</span>
              </div>
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
