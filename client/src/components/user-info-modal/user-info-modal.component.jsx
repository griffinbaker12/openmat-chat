import { useEffect, useState, useRef } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import Spinner from '../spinner/spinner.component';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';
import './user-info-modal.styles.scss';

// This could easily be made more generalizable by saying activeUser and then whatever user you click on will have the same profile

const UserInfoModal = () => {
  const {
    activeUserInfo,
    showModal,
    closeModal,
    isActiveUserCurrentUser,
    setShowActiveUserWithinChatInfo,
    showActiveUserWithinChatInfo,
    chats,
    setActiveChat,
    setChats,
    activeChat,
  } = useChatView();

  const { currentUser, setCurrentUser } = useAuthentication();

  const hiddenInputRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isPicLoading, setIsPicLoading] = useState(false);

  // When you look at their profile, you should be able to chat them, remove or add them as a friend, see their friends...TOMORROW!

  // Could be cool to be able to click either the chats or friends and then re-direct the user to the left hand side to either their chats or their friends. Also, if the active current user IS NOT the current user, then we need to show a back arrow to go back to the active chat

  const goBackToChatInfo = () => setShowActiveUserWithinChatInfo(false);

  const handleChatCreation = async e => {
    e.stopPropagation();

    const soloChats = chats.filter(chat => !chat.isGroupChat);

    const existingChat = soloChats.find(chat =>
      chat.users.some(user => user._id === activeUserInfo._id)
    );

    if (existingChat) {
      closeModal();
      closeDropdown();
      if (activeChat[0]?._id === existingChat._id) return;
      setActiveChat([existingChat]);
    } else {
      const otherParticipantId = [activeUserInfo._id];
      const payload = {
        chatName: null,
        users: otherParticipantId,
      };

      try {
        const response = await fetch(
          `http://localhost:4000/api/chat/createChat`,
          {
            method: 'post',
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        const newChat = await response.json();
        setChats(prevState => [newChat, ...prevState]);
        closeModal();
        closeDropdown();
        defaultToast(TOAST_TYPE.success, 'Chat creation successful');
      } catch (e) {
        defaultToast(TOAST_TYPE.failure, 'Error creating chat');
      }
    }
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

  const handleFileInputChange = e => {
    const picture = e.target.files[0];
    if (e.target.files) {
      postImageDetails(picture);
    } else return;
  };

  const handleImageUpload = () => {
    hiddenInputRef.current.click();
  };

  const postImageDetails = picture => {
    setIsPicLoading(true);
    if (!picture) {
      setIsPicLoading(false);
      return;
    }

    const data = new FormData();
    data.append('file', picture);
    data.append('upload_preset', 'chat-app');

    fetch('https://api.cloudinary.com/v1_1/dhogrpl6c/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        updateUserPicture(data);
      })
      .catch(err => {
        defaultToast(TOAST_TYPE.error, 'Error uploading image');
      });
  };

  const updateUserPicture = async pictureDetails => {
    console.log(pictureDetails);
    fetch('http://localhost:4000/api/user/changeProfilePicture', {
      method: 'put',
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pictureDetails.secure_url,
        token: currentUser.token,
      }),
    })
      .then(res => res.json())
      .then(updatedUser => {
        setCurrentUser(updatedUser);
        setIsPicLoading(false);
        defaultToast(TOAST_TYPE.success, 'Profile photo updated');
      })
      .catch(err => {
        setIsPicLoading(false);
        defaultToast(TOAST_TYPE.error, 'Error updating account');
      });
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
          <div
            style={
              isActiveUserCurrentUser
                ? { paddingTop: '20px' }
                : { paddingTop: '12px' }
            }
            className="user-info-modal-user-detail-container"
          >
            <div className="user-info-modal-user-detail-header-with-buttons">
              <div
                onClick={goBackToChatInfo}
                className="user-info-modal-back-arrow"
                style={
                  isActiveUserCurrentUser
                    ? { visibility: 'hidden' }
                    : {
                        fontSize: '24px',
                      }
                }
              >
                &#8592;
              </div>
              <p className="user-info-modal-name">
                {isActiveUserCurrentUser
                  ? currentUser.name
                  : activeUserInfo.name}
              </p>
            </div>
            <div className="user-info-modal-username-email">
              <p>
                @
                {isActiveUserCurrentUser
                  ? currentUser.userName
                  : activeUserInfo.userName}
              </p>
            </div>
            <div className="user-info-modal-picture-container">
              <img
                height="100%"
                src={
                  isActiveUserCurrentUser
                    ? currentUser.picture
                    : activeUserInfo.picture
                }
                alt="profile"
              />
            </div>
          </div>
          {isActiveUserCurrentUser ? (
            <>
              <input
                ref={hiddenInputRef}
                type="file"
                accept="image/jpeg, image/png"
                id="profile-picture"
                onChange={handleFileInputChange}
                hidden
              />
              <button
                onClick={handleImageUpload}
                type="button"
                className="user-info-button"
              >
                {isPicLoading ? <Spinner /> : 'Change Profile Picture'}
              </button>
            </>
          ) : (
            <button onClick={handleChatCreation} className="user-info-button">
              Send Message
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default UserInfoModal;
