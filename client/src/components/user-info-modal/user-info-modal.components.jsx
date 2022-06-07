import { useContacts } from '../../contexts/contacts-context';
import { useSidebar } from '../../contexts/sidebar-context';
import './user-info-modal.styles.scss';

const UserInfoModal = () => {
  const { activeFriend } = useContacts();
  console.log(activeFriend);
  const { showModal, closeModal } = useSidebar();

  return (
    <div
      className={`user-info-modal-container ${showModal ? 'active' : ''}`}
      onClick={closeModal}
    >
      <div
        className="user-info-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={closeModal} type="button" style={{ color: 'white' }}>
          &#x2715;
        </button>
      </div>
    </div>
  );
};

export default UserInfoModal;
