import { useEffect, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import Tooltip from '../tooltip/tooltip.component';
import UserInfoDropdown from '../user-info-dropdown/user-info-dropdown.component';
import { getMutualFriends } from '../../utils/utils';
import './user-info-modal.styles.scss';

// This could easily be made more generalizable by saying activeUser and then whatever user you click on will have the same profile

const UserInfoModal = () => {
  const {
    activeUserInfo,
    showModal,
    closeModal,
    isActiveUserCurrentUser,
    chats,
    setShowActiveUserWithinChatInfo,
    showActiveUserWithinChatInfo,
  } = useChatView();

  const { currentUser } = useAuthentication();

  const [showDropdown, setShowDropdown] = useState(false);

  // When you look at their profile, you should be able to chat them, remove or add them as a friend, see their friends...TOMORROW!

  // Could be cool to be able to click either the chats or friends and then re-direct the user to the left hand side to either their chats or their friends. Also, if the active current user IS NOT the current user, then we need to show a back arrow to go back to the active chat

  const goBackToChatInfo = () => setShowActiveUserWithinChatInfo(false);

  const handleDropdown = () => {
    setShowDropdown(prevState => !prevState);
  };

  const handleModalClick = e => {
    e.stopPropagation();
    if (showDropdown) {
      setShowDropdown(false);
      return;
    }
    closeModal();
  };

  const closeDropdown = () => setShowDropdown(false);

  const closeUserInfoDropdownAndStopPropagation = e => {
    const ellipsisPress = e.target.closest('.user-info-modal-back-ellipsis');
    e.stopPropagation();

    if (!ellipsisPress) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeUserInfoDropdownAndStopPropagation);
    return () =>
      document.removeEventListener(
        'click',
        closeUserInfoDropdownAndStopPropagation
      );
  });

  return (
    activeUserInfo &&
    showActiveUserWithinChatInfo && (
      <div
        className={`user-info-modal-container ${showModal ? 'active' : ''}`}
        onClick={handleModalClick}
      >
        <div
          className="user-info-modal-content"
          onClick={closeUserInfoDropdownAndStopPropagation}
        >
          <div
            style={
              isActiveUserCurrentUser
                ? { visibility: 'visible', marginBottom: '4px' }
                : { display: 'none' }
            }
            className="user-info-modal-button-container"
          >
            <button
              onClick={closeModal}
              type="button"
              style={{ color: 'white' }}
            >
              &#x2715;
            </button>
          </div>
          <div className="user-info-modal-user-detail-container">
            <div className="user-info-modal-user-detail-header-with-buttons">
              <div
                onClick={goBackToChatInfo}
                className="user-info-modal-back-arrow"
                style={
                  isActiveUserCurrentUser
                    ? { visibility: 'hidden' }
                    : {
                        fontSize: '24px',
                        paddingLeft: '4px',
                        paddingRight: '12px',
                        marginBottom: '6px',
                      }
                }
              >
                &#8592;
              </div>
              <p className="user-info-modal-name">{activeUserInfo.name}</p>
              <div
                onClick={handleDropdown}
                className="user-info-modal-back-ellipsis"
                style={
                  isActiveUserCurrentUser
                    ? { visibility: 'hidden' }
                    : {
                        visibility: 'visible',
                        paddingRight: '4px',
                        paddingLeft: '12px',
                        marginTop: '4px',
                        fontWeight: 'bold',
                      }
                }
              >
                &#8942;
              </div>
              {showDropdown && (
                <UserInfoDropdown closeDropdown={closeDropdown} />
              )}
            </div>
            <div className="user-info-modal-username-email">
              <p>@{activeUserInfo.userName}</p>
            </div>
            <div className="user-info-modal-picture-container">
              <img height="100%" src={activeUserInfo.picture} alt="profile" />
            </div>
            <div className="user-info-modal-additional-user-info-container">
              {/* If the user is not the current user, then calculate the number of mutual friends and mutual conversations */}
              <p>{`${getMutualFriends(
                activeUserInfo.friends,
                currentUser.friends
              )} ${isActiveUserCurrentUser ? '' : 'Mutual'} Friends`}</p>
              {/* Insert a little chevron to see a dropdown of all of their friends, remove them as a friend in red, can make this more generalizable just as any user profie that you click on with the if friend then delete or add friend */}
              {/* Could do the same but with conversations, mutual servers / convos. And then when you are looking at this from the perspective of the current user, it would lead you to the left side, either the conversations, or to your frineds, not even sure if that is necessary tbh */}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserInfoModal;
