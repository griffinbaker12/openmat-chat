import { useState } from 'react';
import ChatPreview from '../chat-preview/chat-preview.component';
import Modal from '../modal/modal.component';
import './side-bar.styles.scss';
import ContactPreview from '../contact-preview/contact-preview.component';

const SideBar = () => {
  const [sideBarCategory, setSideBarCategory] = useState('conversations');
  const [showModal, setShowModal] = useState(false);

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

      {sideBarCategory === 'conversations' ? (
        <ChatPreview />
      ) : (
        <ContactPreview />
      )}

      <div className="new-convo-container">
        <div className="userName">@griffinbaker12</div>
        <button onClick={() => setShowModal(true)} type="button">
          {sideBarCategory === 'conversations'
            ? 'New Conversation'
            : 'Add Friend'}
        </button>
      </div>

      {
        <Modal
          showModal={showModal}
          closeModal={closeModal}
          sideBarCategory={sideBarCategory}
        />
      }
    </div>
  );
};

export default SideBar;
