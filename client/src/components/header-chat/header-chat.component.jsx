import { useState, useRef } from 'react';
import AccountDropdown from '../account-dropdown/account-dropdown.component';
import { ReactComponent as NotificationBell } from '../../assets/notification-bell.svg';
import { useAuthentication } from '../../contexts/authentication-context';
import './header-chat.styles.scss';

const HeaderChat = ({ logo }) => {
  const { currentUser } = useAuthentication();
  const { picture } = currentUser;
  const [toggleAccount, setToggleAccount] = useState(false);
  const accountContainerRef = useRef();

  // What I still need to do here obviously is track when new messages come in or friend requests and stuff like that, count them up, and then display them here

  const handleAccountClick = () => setToggleAccount(prevState => !prevState);

  return (
    <div className="header-chat-container">
      <div className="header-chat-logo-container">
        <img src={logo} height="100%" width="auto" alt="open mat logo" />
      </div>
      <div className="header-chat-title">
        <p>OpenMat Chat</p>
      </div>
      <div className="header-chat-links">
        <div className="header-chat-link notification-bell">
          <NotificationBell />
          <div className="notification-count">5</div>
        </div>
        <div
          ref={accountContainerRef}
          onClick={handleAccountClick}
          className="header-chat-link"
        >
          <button className="header-user-account-container">
            <img height="100%" src={picture} alt="profile" />
          </button>
        </div>
      </div>
      {toggleAccount && (
        <AccountDropdown
          ref={accountContainerRef}
          handleDropdown={setToggleAccount}
        />
      )}
    </div>
  );
};

export default HeaderChat;
