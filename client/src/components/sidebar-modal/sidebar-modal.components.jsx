import { useSidebar } from '../../contexts/sidebar-context';
import AddFriendModal from '../add-friend-modal/add-friend-modal.component';
import NewConversationModal from '../new-conversation-modal/new-conversation-modal.component';
import './sidebar-modal.styles.scss';

const SidebarModal = () => {
  const { showModal, closeModal, sideBarCategory } = useSidebar();

  return (
    <div
      className={`sidebar-modal-container ${showModal ? 'active' : ''}`}
      onClick={closeModal}
    >
      <div className="sidebar-modal-content" onClick={e => e.stopPropagation()}>
        <div className="sidebar-modal-header">
          <p>
            {sideBarCategory === 'conversations'
              ? 'Create Chat Room'
              : 'Add Friend'}
          </p>
          <button onClick={closeModal} type="button" style={{ color: 'white' }}>
            &#x2715;
          </button>
        </div>
        {sideBarCategory === 'conversations' ? (
          <NewConversationModal />
        ) : (
          <AddFriendModal />
        )}
      </div>
    </div>
  );
};

export default SidebarModal;
