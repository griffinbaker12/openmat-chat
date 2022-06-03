import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import Spinner from '../spinner/spinner.component';
import Toast from '../toast/toast.component.styles';
import { TOAST_TYPE } from '../toast/toast.component.styles';
import './register.styles.scss';

const Register = () => {
  const [picCloudUrl, setPicCloudUrl] = useState();
  const [text, setText] = useState({ name: '', email: '', password: '' });
  const [isPicLoading, setIsPicLoading] = useState(false);

  const navigate = useNavigate();

  // General idea here as I surmise is that you render this toast container component that is a vertical flex of a bunch of different toasts that may pop up and then you handle which ones you render and when, which type, text, etc...
  // const [toastType, setToastType] = useState();

  const { changeAuth, setCurrentUser, isLoading, setIsLoading } =
    useAuthentication();

  const toastRef = useRef(null);
  const hiddenInputRef = useRef();

  const handleRegistration = () => {
    // If the user does not submit all of the details, then could display a toast telling them to do so.
    if (!text.name || !text.email || !text.password) return;
    // Could make a separate is loading for the component as a whole
    setIsLoading(true);
    fetch('http://localhost:4000/api/user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: text.email,
        password: text.password,
        name: text.name,
        picture: picCloudUrl,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
        // Until we and if we use redux with the persisted state, but otherwise we can just check to see if there is a current user
        localStorage.setItem('userInfo', JSON.stringify(data));
        setIsLoading(false);
        navigate('/chat');
        // Here you would render the toast saying that the registration was a success

        // Using chakra ui for something like this would be much easier; else would require you to implement logic on the success state of various different requests and then render the toast accordingly
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        // Here you would render that toast saying that there was a problem registering a user, most likely because the user credentials already exists
      });

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
        toastRef.current.show();
        // setToastType(TOAST_TYPE.success);
      })
      .catch(err => {
        setIsPicLoading(false);
        // toastRef.current.show();
        // setToastType(TOAST_TYPE.failure);
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
                accept="image/jpeg, image/png"
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
                        height: '80px',
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
          <button
            className="register-input"
            type="button"
            onClick={handleRegistration}
          >
            {isLoading ? <Spinner /> : 'Sign Up'}
          </button>
          <p onClick={changeAuth} className="sign-in-text">
            Back to Sign In
          </p>
          {/* <Toast
            ref={toastRef}
            message={
              toastType === TOAST_TYPE.success
                ? 'Image upload successful'
                : 'Error uploading image'
            }
            type={
              toastType === TOAST_TYPE.success
                ? TOAST_TYPE.success
                : TOAST_TYPE.failure
            }
          /> */}
        </div>
      </main>
    </article>
  );
};

export default Register;
