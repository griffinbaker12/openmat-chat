import { useState } from 'react';
import { ReactComponent as ChatIcon } from '../../assets/chat-icon.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import AddFriendModal from '../add-friend-modal/add-friend-modal.component';
import NewConversationModal from '../new-conversation-modal/new-conversation-modal.component';
import './side-bar.styles.scss';

const SideBar = () => {
  const [sideBarCategory, setSideBarCategory] = useState('conversations');
  const [showModal, setShowModal] = useState(false);
  console.log(showModal, sideBarCategory);

  const closeModal = () => setShowModal(false);

  const handleCategoryChange = () =>
    setSideBarCategory(prevState =>
      prevState === 'conversations' ? 'friends' : 'conversations'
    );

  // The best way to do this is to actually change the active one to the one that is actually clicked so that you can't toggle like it currently is

  // Chat state and then map over to add in all of the different chat previews

  // Need to keep a state of which button is active

  // To make the cursor what you want it to be may also have to do something where you just add on the additional "active" or not.

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
        <div className="username">@griffinbaker12</div>
        <button onClick={() => setShowModal(true)} type="button">
          {sideBarCategory === 'conversations'
            ? 'New Conversation'
            : 'Add Friend'}
        </button>
      </div>

      {sideBarCategory === 'conversations' ? (
        <NewConversationModal showModal={showModal} closeModal={closeModal} />
      ) : (
        <AddFriendModal showModal={showModal} closeModal={closeModal} />
      )}
    </div>
  );
};

export default SideBar;
