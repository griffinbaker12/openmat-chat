import './new-conversation-modal.styles.scss';

const NewConversationModal = ({ showModal, closeModal }) => {
  return (
    <div
      className={`new-conversation-modal-container ${
        showModal ? 'active' : ''
      }`}
    >
      <div className="new-conversation-modal-content">
        <div className="new-conversation-modal-header">
          <p>Create Contact</p>
          <button onClick={closeModal} type="button">
            X
          </button>
        </div>
        <div className="new-conversation-modal-body">
          <p>Create Contact</p>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
