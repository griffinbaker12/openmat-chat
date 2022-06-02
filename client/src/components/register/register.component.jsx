import { useRef, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import './register.styles.scss';

const Register = () => {
  const hiddenInputRef = useRef();
  const [picCloudUrl, setPicCloudUrl] = useState();
  const [text, setText] = useState({ name: '', email: '', password: '' });
  const [isPicLoading, setIsPicLoading] = useState(false);
  const { changeAuth } = useAuthentication();

  const handleChange = e => {
    const name = e.target.getAttribute('name');
    setText(prevState => {
      return {
        ...prevState,
        [name]: e.target.value,
      };
    });
  };

  // https://api.cloudinary.com/v1_1/dhogrpl6c/upload

  const handleFileInputChange = e => {
    const picture = e.target.files[0];
    if (e.target.files) {
      postImageDetails(picture);
    } else return;
  };

  const handleImageUpload = () => {
    // Simulate a click on hidden button
    hiddenInputRef.current.click();
  };

  const postImageDetails = picture => {
    setIsPicLoading(true);
    if (!picture) {
      setIsPicLoading(false);
      return;
    }

    const data = new FormData();
    data.append('file', picture);
    data.append('upload_preset', 'chat-app');

    fetch('https://api.cloudinary.com/v1_1/dhogrpl6c/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        setPicCloudUrl(data.url.toString());
        setIsPicLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsPicLoading(false);
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
              <input
                ref={hiddenInputRef}
                type="file"
                accept="image/*"
                id="profile-picture"
                onChange={handleFileInputChange}
                hidden
              />
              <button
                onClick={handleImageUpload}
                type="button"
                id="profile-picture-button"
              >
                {isPicLoading ? <Spinner /> : 'Select Profile Picture Image'}
              </button>
              <div className="profile-picture-text-container">
                <span id="profile-picture-text">
                  {picCloudUrl ? (
                    <img
                      src={picCloudUrl}
                      alt="profile"
                      style={{
                        height: '100px',
                        width: 'auto',
                        marginTop: '5px',
                      }}
                    />
                  ) : (
                    'No image uploaded yet'
                  )}
                </span>
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
