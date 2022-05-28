import { useRef } from 'react';
import { useContacts } from '../../contexts/contacts-context';
import './add-friend-modal.styles.scss';

const AddFriendModal = ({ closeModal }) => {
  const { createContact } = useContacts();
  const userNameRef = useRef();
  // const nameRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    createContact(userNameRef.current.value);
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
