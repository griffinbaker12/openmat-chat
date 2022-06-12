import { useEffect, useState, useRef, Fragment } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import UserInfoModal from '../user-info-modal/user-info-modal.component';
import { ReactComponent as ChevronRight } from '../../assets/chevron-right.svg';
import { ReactComponent as EditPencil } from '../../assets/pencil.svg';
import SearchResult from '../search-result/search-result-component';
import AddUserDropdown from '../add-user-dropdown/add-user-dropdown.component';
import './chat-info-modal.styles.scss';
import Tooltip from '../tooltip/tooltip.component';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';

const ChatInfoModal = ({ userFlag }) => {
  const { currentUser } = useAuthentication();
  const {
    activeChat,
    setActiveChat,
    chats,
    setChats,
    showModal,
    closeModal,
    fetchChats,
    showAddUserInfoDropdown,
    setShowAddUserInfoDropdown,
  } = useChatView();

  const [showChatEdit, setShowChatEdit] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const chatEditInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(activeChat[0], userFlag);

  useEffect(() => {
    if (!chatEditInputRef.current) return;
    chatEditInputRef.current.focus();
  }, [showChatEdit]);

  useEffect(() => {
    if (!activeChat[0]) return;
    setNewChatName(activeChat[0].chatName);
  }, [activeChat, showChatEdit]);

  const closeAddUserInfoAndStopPropagation = e => {
    const addButtonPress = e.target.closest('.add-button-container');
    e.stopPropagation();

    if (!addButtonPress) {
      setShowAddUserInfoDropdown(false);
    }
  };

  const handleShowUserDropdown = () =>
    setShowAddUserInfoDropdown(prevState => !prevState);

  const handleLeaveChat = async e => {
    try {
      const response = await fetch('http://localhost:4000/api/chat/leaveChat', {
        method: 'put',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: activeChat[0]._id,
        }),
      });

      const updatedChat = await response.json();
      closeModal();
      fetchChats();
      defaultToast(TOAST_TYPE.success, 'You have left the chat');
    } catch (error) {
      defaultToast(TOAST_TYPE.failure, 'Error leaving chat');
    }
  };

  const handleKeyChange = async e => {
    if (e.code !== 'Enter') return;
    if (newChatName === activeChat[0].chatName) {
      setShowChatEdit(false);
      return;
    }
    if (!newChatName) {
      defaultToast(TOAST_TYPE.error, 'Chat name cannot be blank');
      setNewChatName(activeChat[0].chatName);
      setShowChatEdit(false);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/chat/renameChat',
        {
          method: 'put',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: activeChat[0]._id,
            chatName: newChatName,
          }),
        }
      );

      const updatedChat = await response.json();
      setActiveChat([updatedChat]);
      setShowChatEdit(false);
      fetchChats();
    } catch (error) {
      defaultToast(TOAST_TYPE.failure, 'Error re-naming chat');
    }
  };

  const handleChatNameChange = e => {
    setNewChatName(e.target.value);
  };

  const handleEditChatName = () => {
    setShowChatEdit(prevState => !prevState);
  };
  // So what I am going to need to is to set the state of the input field to be equal to the current chat name so that when you switch the component on click the name is already filled

  // This is sick you can also just store an object with the different users that you visited and each time you go back you go back to the prior user...apparently can also use a graph for this as well

  // Check if it is a solo chat or a group chat, and then render a different modal accordingly

  // Could have also made calsses that I would apply across the different modals, but at this point..

  // If it is a group chat, then I want to show the entire chat, and then once you click on a user, I actually just want to switch to not show the group chat, but to show the actual user info-modal, hide the group chat, and include a back arrow

  return (
    <div
      name="chat-info-modal"
      className={`chat-info-modal-container ${showModal ? 'active' : ''}`}
      onClick={closeModal}
    >
      <div
        className="chat-info-modal-content"
        onClick={closeAddUserInfoAndStopPropagation}
      >
        {(activeChat[0] && activeChat[0].isGroupChat) || userFlag ? (
          <>
            <div className="group-chat-modal-header">
              <input
                ref={chatEditInputRef}
                className="group-chat-modal-header-chat-name"
                onKeyDown={handleKeyChange}
                onChange={handleChatNameChange}
                value={newChatName}
                style={
                  !showChatEdit
                    ? { display: 'none' }
                    : { visibility: 'visible' }
                }
              />
              <p
                style={
                  !showChatEdit
                    ? { visibility: 'visible' }
                    : { display: 'none' }
                }
              >
                {activeChat[0].chatName}
              </p>
              <Tooltip content="Click to edit chat name">
                <div
                  className="edit-pencil-container"
                  onClick={handleEditChatName}
                >
                  <EditPencil />
                </div>
              </Tooltip>
              <button
                onClick={closeModal}
                type="button"
                style={{ color: 'white', marginLeft: 'auto' }}
              >
                &#x2715;
              </button>
            </div>
            <div className="group-chat-modal-body">
              <div className="group-chat-modal-chat-participants-container">
                <div className="group-chat-modal-member-header-container">
                  <p>Members</p>
                  <Tooltip content="Click to add user">
                    <div
                      onClick={handleShowUserDropdown}
                      className="add-button-container"
                    >
                      <span>+</span>
                    </div>
                  </Tooltip>
                  {showAddUserInfoDropdown && <AddUserDropdown />}
                </div>
                <div className="group-chat-modal-member-container">
                  {activeChat[0].users.map(user => (
                    <div
                      key={user._id}
                      name={user._id}
                      className="group-chat-modal-user-info-container"
                    >
                      <div className="group-chat-modal-user-info-picture-container">
                        <img height="100%" src={user.picture} alt="user" />
                      </div>
                      <div className="user-name-user-userName-container">
                        <p>{user.name}</p>
                        <p>@{user.userName}</p>
                      </div>
                      <div className="chevron-container">
                        <ChevronRight />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div onClick={handleLeaveChat} className="chat-info-modal-button">
                <button className="leave-chat-button" type="submit">
                  Leave Chat
                </button>
              </div>
            </div>
          </>
        ) : (
          <UserInfoModal />
        )}
      </div>
    </div>
  );
};
export default ChatInfoModal;
