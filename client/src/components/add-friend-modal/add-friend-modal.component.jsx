import './add-friend-modal.styles.scss';

const AddFriendModal = ({ showModal, closeModal }) => {
  return (
    <div
      className={`add-friend-modal-container ${showModal} ? 'active' : ''}`}
    ></div>
  );
};

export default AddFriendModal;
