import { useMemo } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import { areFriends } from '../../utils/utils';
import './user-info-dropdown.styles.scss';

const UserInfoDropdown = ({ closeDropdown }) => {
  const { currentUser } = useAuthentication();
  const {
    activeUserInfo,
    chats,
    setChats,
    setActiveChat,
    closeModal,
    activeChat,
  } = useChatView();

  console.log(activeChat);

  const areFriendsBool = useMemo(
    () => areFriends(currentUser, activeUserInfo),
    [currentUser, activeUserInfo]
  );

  const handleChatCreation = e => {
    e.stopPropagation();

    const soloChats = chats.filter(chat => !chat.isGroupChat);

    const existingChat = soloChats.find(chat =>
      chat.users.some(user => user._id === activeUserInfo._id)
    );

    console.log(existingChat);

    if (existingChat) {
      closeModal();
      closeDropdown();
      setActiveChat([existingChat]);
      return;
    }
  };

  const handleFriendRequest = e => {
    e.stopPropagation();
    console.log('hey from friend request');
    // Thinking that you could just add them as a friend in the current user, and then when you get a response from the other side, either add them as a friend for that user, or, if they reject, then delete them from the current user's friend list (maybe with a pending flag or something like that)
  };

  return (
    <div
      className={`user-info-dropdown-container ${
        areFriendsBool ? 'friends' : 'not-friends'
      }`}
    >
      <button
        onClick={handleFriendRequest}
        className={`user-info-dropdown-friend-status-container ${
          areFriendsBool ? 'friends' : 'not-friends'
        }`}
      >{`${areFriendsBool ? 'Remove' : 'Add'} Friend`}</button>
      <button
        onClick={handleChatCreation}
        className="user-info-dropdown-send-message-container"
      >
        Send Message
      </button>
    </div>
  );
};
export default UserInfoDropdown;
