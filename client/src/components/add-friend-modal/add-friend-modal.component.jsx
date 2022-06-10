import { useRef } from 'react';
import { useChatView } from '../../contexts/chat-view-context';
import './add-friend-modal.styles.scss';

const AddFriendModal = () => {
  const { closeModal } = useChatView();
  const userNameRef = useRef();
  // const nameRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    closeModal();
    // Also need to clear the form here as well
    userNameRef.current.value = '';
  };

  return (
    <div className="add-friend-modal-body">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input ref={userNameRef} type="text" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddFriendModal;
