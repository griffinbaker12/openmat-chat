import { useRef } from 'react';
import { useContacts } from '../../contexts/contacts-context';
import './add-friend-modal.styles.scss';

const AddFriendModal = ({ closeModal }) => {
  const { createContact } = useContacts();
  const usernameRef = useRef();
  // const nameRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    createContact(usernameRef.current.value);
    closeModal();
    // Also need to clear the form here as well
    usernameRef.current.value = '';
  };

  return (
    <div className="add-friend-modal-body">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input ref={usernameRef} type="text" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddFriendModal;
