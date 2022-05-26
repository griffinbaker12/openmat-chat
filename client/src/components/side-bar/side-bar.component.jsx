import { useState } from 'react';
import { ReactComponent as ChatIcon } from '../../assets/chat-icon.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import './side-bar.styles.scss';

const SideBar = () => {
  const [sideBarCategory, setSideBarCategory] = useState('conversations');

  const handleCategoryChange = () =>
    setSideBarCategory(prevState =>
      prevState === 'conversations' ? 'friends' : 'conversations'
    );

  // The best way to do this is to actually change the active one to the one that is actually clicked so that you can't toggle like it currently is

  // Chat state and then map over to add in all of the different chat previews

  // Need to keep a state of which button is active

  return (
    <div className="side-bar-container">
      <div onClick={handleCategoryChange} className="side-bar-header-container">
        <div
          className={`side-bar-category ${
            sideBarCategory === 'conversations'
              ? 'side-bar-category-active'
              : ''
          } conversations`}
        >
          Conversations
        </div>
        <div
          className={`side-bar-category ${
            sideBarCategory === 'friends' ? 'side-bar-category-active' : ''
          } contacts`}
        >
          Friends
        </div>
      </div>

      <ChatPreview />

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
