import { useChatView } from '../../contexts/chat-view-context';
import Tooltip from '../tooltip/tooltip.component';
import './user-info-modal.styles.scss';

// This could easily be made more generalizable by saying activeUser and then whatever user you click on will have the same profile

const UserInfoModal = () => {
  const {
    activeUserInfo,
    showModal,
    closeModal,
    isActiveUserCurrentUser,
    chats,
  } = useChatView();

  // When you look at their profile, you should be able to chat them, remove or add them as a friend, see their friends...TOMORROW!

  // Could be cool to be able to click either the chats or friends and then re-direct the user to the left hand side to either their chats or their friends. Also, if the active current user IS NOT the current user, then we need to show a back arrow to go back to the active chat

  return (
    activeUserInfo && (
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
            <div className="user-info-modal-user-detail-header">
              <p className="user-info-modal-name">{activeUserInfo.name}</p>
              <div className="user-info-modal-username-email">
                <p>@{activeUserInfo.userName}</p>
              </div>
            </div>
            <div className="user-info-modal-picture-container">
              <img height="100%" src={activeUserInfo.picture} alt="profile" />
            </div>
            <div className="user-info-modal-additional-user-info-container">
              <p>{chats.length} Chats</p>
              <span>&#8226;</span>
              <p>{activeUserInfo.friends.length} Friends </p>
              {/* Insert a little chevron to see a dropdown of all of their friends, remove them as a friend in red, can make this more generalizable just as any user profie that you click on with the if friend then delete or add friend */}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserInfoModal;
