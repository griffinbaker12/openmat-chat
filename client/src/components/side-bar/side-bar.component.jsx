import { ReactComponent as ChatIcon } from '../../assets/chat-icon.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import './side-bar.styles.scss';

const SideBar = () => {
  // Chat state and then map over to add in all of the different chat previews

  return (
    <div className="side-bar-container">
      <div className="side-bar-header-container">
        <div className="conversations">Conversations</div>
        <div className="contacts">Contacts</div>
      </div>
      <div className="chat-preview-container">
        <ChatPreview />
      </div>
      <div className="new-convo-container">
        <p className="username">@griffinbaker12</p>
        <div className="chat-icon-container">
          <ChatIcon className="chat-icon" />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
