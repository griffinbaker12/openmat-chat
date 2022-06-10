import { useChatView } from '../../contexts/chat-view-context';
import Tooltip from '../tooltip/tooltip.component';
import './user-info-modal.styles.scss';

// This could easily be made more generalizable by saying activeUser and then whatever user you click on will have the same profile

const UserInfoModal = () => {
  const { activeFriend, showModal, closeModal } = useChatView();

  // When you look at their profile, you should be able to chat them, remove or add them as a friend, see their friends...TOMORROW!

  return (
    <>
      {activeFriend && (
        <div
          className={`user-info-modal-container ${showModal ? 'active' : ''}`}
          onClick={closeModal}
        >
          <div
            className="user-info-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="user-info-modal-button-container">
              <button
                onClick={closeModal}
                type="button"
                style={{ color: 'white' }}
              >
                &#x2715;
              </button>
            </div>
            <div className="user-info-modal-user-detail-container">
              <div className="user-info-modal-picture-container">
                <img height="100%" src={activeFriend.picture} alt="profile" />
              </div>
              <div className="user-info-modal-user-info-container">
                <p>{activeFriend.name}</p>
                <p>{activeFriend.friends.length} Friends</p>
                {/* Insert a little chevron to see a dropdown of all of their friends, remove them as a friend in red, can make this more generalizable just as any user profie that you click on with the if friend then delete or add friend */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfoModal;
