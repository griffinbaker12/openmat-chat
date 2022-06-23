import { useState, useRef } from 'react';
import AccountDropdown from '../account-dropdown/account-dropdown.component';
import NotificationDropdown from '../notification-dropdown/notification-dropdown.component';
import { ReactComponent as NotificationBell } from '../../assets/notification-bell.svg';
import { useAuthentication } from '../../contexts/authentication-context';
import './header-chat.styles.scss';
import { useChatView } from '../../contexts/chat-view-context';

const HeaderChat = ({ logo }) => {
  const { currentUser } = useAuthentication();
  const { picture } = currentUser;
  const { notifications } = useChatView();
  const [toggleAccount, setToggleAccount] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const accountContainerRef = useRef();
  const notificationContainerRef = useRef();

  console.log(accountContainerRef);

  // What I still need to do here obviously is track when new messages come in or friend requests and stuff like that, count them up, and then display them here

  const handleAccountClick = () => setToggleAccount(prevState => !prevState);

  const handleNotificationClick = () =>
    setToggleNotification(prevState => !prevState);

  const closeAccountDropdown = () => setToggleAccount(false);

  const closeNotificationDropdown = () => setToggleNotification(false);

  return (
    <div className="header-chat-container">
      <div className="header-chat-logo-container">
        <img src={logo} height="100%" width="auto" alt="open mat logo" />
      </div>
      <div className="header-chat-title">
        <p>OpenMat Chat</p>
      </div>
      <div className="header-chat-links">
        <div
          ref={notificationContainerRef}
          onClick={handleNotificationClick}
          className="header-chat-link notification-bell"
        >
          <NotificationBell />
          {notifications && notifications.length > 0 ? (
            <div className="notification-count">{notifications.length}</div>
          ) : (
            ''
          )}
        </div>
        <div
          ref={accountContainerRef}
          onClick={handleAccountClick}
          className="header-chat-link user-account"
        >
          <button className="header-user-account-container">
            <img src={picture} alt="profile" />
          </button>
        </div>
      </div>
      {toggleNotification && (
        <NotificationDropdown
          ref={notificationContainerRef}
          handleDropdown={setToggleNotification}
          closeAccountDropdown={closeAccountDropdown}
          closeNotificationDropdown={closeNotificationDropdown}
        />
      )}
      {toggleAccount && (
        <AccountDropdown
          ref={accountContainerRef}
          handleDropdown={setToggleAccount}
          closeAccountDropdown={closeAccountDropdown}
          closeNotificationDropdown={closeNotificationDropdown}
        />
      )}
    </div>
  );
};

export default HeaderChat;
