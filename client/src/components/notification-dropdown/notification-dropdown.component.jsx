import { forwardRef, useRef } from 'react';

const NotificationDropdown = forwardRef(
  (
    { handleDropdown, closeAccountDropdown, closeNotificationDropdown },
    ref
  ) => {
    const dropDownRef = useRef();

    const handleSignOutClick = e => {
      if (ref.current === e.target.closest('.header-chat-link')) {
        return;
      }
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        closeAccountDropdown();
      }
    };

    // useEffect(() => {
    //   document.addEventListener('mousedown', handleSignOutClick);
    //   return () => document.removeEventListener('mousedown', handleSignOutClick);
    // });

    return (
      <div
        onClick={handleSignOutClick}
        ref={dropDownRef}
        className="account-dropdown-container"
      >
        <div className="account-dropdown-content-container">
          {/* <p onClick={handleAccountClick}>View Profile</p> */}
          {/* <button onClick={signOutUser} type="button"> */}
          Sign Out
          {/* </button> */}
        </div>
      </div>
    );
  }
);
export default NotificationDropdown;
