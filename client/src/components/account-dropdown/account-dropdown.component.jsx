import { forwardRef, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contexts/authentication-context';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import './account-dropdown.styles.scss';

const AccountDropdown = forwardRef(({ closeAccountDropdown }, ref) => {
  const navigate = useNavigate();
  const dropDownRef = useRef();
  const { handleModal, setUserInfoModal } = useChatView();
  const { currentUser } = useAuthentication();

  const handleSignOutClick = e => {
    if (ref.current === e.target.closest('.header-chat-link')) {
      return;
    }
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      closeAccountDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleSignOutClick);
    return () => document.removeEventListener('mousedown', handleSignOutClick);
  });

  const handleAccountClick = () => {
    closeAccountDropdown();
    setUserInfoModal(null, true);
    handleModal(MODAL_TYPE.userInfo);
  };

  const signOutUser = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    defaultToast(TOAST_TYPE.success, 'Goodbye 👋🏼');
  };

  return (
    <div
      onClick={handleSignOutClick}
      ref={dropDownRef}
      className="account-dropdown-container"
    >
      <div className="account-dropdown-content-container">
        <p onClick={handleAccountClick}>View Profile</p>
        <button onClick={signOutUser} type="button">
          Sign Out
        </button>
      </div>
    </div>
  );
});

export default AccountDropdown;
