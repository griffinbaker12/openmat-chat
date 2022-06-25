import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-preview.styles.scss';
import {
  generateChatNameForSoloChats,
  getUsersOnlineCount,
  userSent,
} from '../../utils/utils';
import { useSocket } from '../../contexts/socket-context';

const ChatPreview = () => {
  const { currentUser } = useAuthentication();
  const { activeChat, setActiveChat, chats, windowDimensions, setActiveView } =
    useChatView();

  const { onlineUsers } = useSocket();

  const handleClick = e => {
    const element = e.target.closest('.chat-preview-list');
    const chatId = element.getAttribute('name');

    if (!chatId || chatId === activeChat[0]?._id) return;

    if (windowDimensions.width <= 900) {
      setActiveView('chat');
    }

    const newActiveChat = chats.find(chat => chat._id === chatId);
    setActiveChat([newActiveChat]);
  };

  return (
    <div className="chat-preview-container" onClick={handleClick}>
      {chats.length > 0 &&
        chats.map(({ _id, chatName, users, isGroupChat, latestMessage }) => {
          const userOnlineCount = getUsersOnlineCount(
            onlineUsers,
            users,
            currentUser
          );

          return (
            <div
              key={_id}
              name={_id}
              className={`chat-preview-list ${
                _id === activeChat[0]?._id ? 'active' : ''
              }`}
            >
              <div className="chat-preview-list-item">
                <p className="chat-preview-list-name-container">
                  {!isGroupChat
                    ? generateChatNameForSoloChats(users, currentUser)
                    : chatName}
                </p>
                {latestMessage && (
                  // <div className="chat-preview-list-latest-message-container">
                  <div className="chat-preview-list-latest-message-container">
                    <span>
                      {`${
                        userSent(currentUser, latestMessage)
                          ? 'You'
                          : latestMessage.sender.name.split(' ')[0]
                      }`}
                    </span>
                    : {latestMessage.text}
                  </div>
                )}
              </div>

              <div className="chat-preview-list-circle-and-count-container">
                {userOnlineCount > 0 ? (
                  <>
                    <div className="online-circle" />
                    <div>
                      {userOnlineCount === 1 && !isGroupChat
                        ? 'Online'
                        : `${userOnlineCount} Online`}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="offline-circle" />
                    <div> {!isGroupChat ? 'Offline' : `0 Online`}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChatPreview;
