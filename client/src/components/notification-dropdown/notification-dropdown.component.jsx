import { forwardRef, useRef, useEffect } from 'react';
import './notification-dropdown.styles.scss';

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
        // console.log(dropDownRef.current);
        closeNotificationDropdown();
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleSignOutClick);
      return () =>
        document.removeEventListener('mousedown', handleSignOutClick);
    });

    return (
      <div
        onClick={handleSignOutClick}
        ref={dropDownRef}
        className="notification-dropdown-container"
      >
        <div className="notification-dropdown-content-container">
          <p>View Profile</p>
          <button type="button">Sign Out</button>
        </div>
      </div>
    );
  }
);
export default NotificationDropdown;
