import { forwardRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import './account-dropdown.styles.scss';

const AccountDropdown = forwardRef(({ handleDropdown }, ref) => {
  const { currentUser } = useAuthentication();
  const navigate = useNavigate();
  const { picture, name } = currentUser;
  const dropDownRef = useRef();

  const handleClick = e => {
    if (ref.current === e.target.closest('.header-chat-link')) {
      return;
    }
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      handleDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  });

  const signOutUser = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div ref={dropDownRef} className="account-dropdown-container">
      <div className="account-dropdown-content-container">
        <div className="account-dropdown-header-container">
          <div className="account-dropdown-image-container">
            <img height="100%" src={picture} alt="profile" />
          </div>
          <p>{name}</p>
        </div>
        <button onClick={signOutUser} type="button">
          Sign Out
        </button>
      </div>
    </div>
  );
});

export default AccountDropdown;
