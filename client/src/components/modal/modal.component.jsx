import { useRef } from 'react';
import NewConversationModal from '../new-conversation-modal/new-conversation-modal.component';
import AddFriendModal from '../add-friend-modal/add-friend-modal.component';
import './modal.styles.scss';

const Modal = ({ showModal, closeModal, sideBarCategory }) => {
  return (
    <div
      className={`modal-container ${showModal ? 'active' : ''}`}
      onClick={closeModal}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p>
            {sideBarCategory === 'conversations'
              ? 'Create Chat Room'
              : 'Add Friend'}
          </p>
          <button onClick={closeModal} type="button">
            &#x2715;
          </button>
        </div>
        {sideBarCategory === 'conversations' ? (
          <NewConversationModal closeModal={closeModal} />
        ) : (
          <AddFriendModal closeModal={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Modal;
