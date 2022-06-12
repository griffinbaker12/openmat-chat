import { forwardRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import './account-dropdown.styles.scss';

const AccountDropdown = forwardRef(({ handleDropdown }, ref) => {
  const navigate = useNavigate();
  const dropDownRef = useRef();
  const { handleModal } = useChatView();
  const { currentUser } = useChatView();

  const handleSignOutClick = e => {
    if (ref.current === e.target.closest('.header-chat-link')) {
      return;
    }
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      handleDropdown(false);
    }
  };

  const handleAccountClick = () => {
    handleModal(MODAL_TYPE.userInfo);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleSignOutClick);
    return () => document.removeEventListener('mousedown', handleSignOutClick);
  });

  const signOutUser = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div ref={dropDownRef} className="account-dropdown-container">
      <div className="account-dropdown-content-container">
        <p onClick={handleModal}>View Profile</p>
        <button onClick={handleSignOutClick} type="button">
          Sign Out
        </button>
      </div>
    </div>
  );
});

export default AccountDropdown;
