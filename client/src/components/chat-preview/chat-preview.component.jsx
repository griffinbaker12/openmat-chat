import { useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-preview.styles.scss';
import {
  generateChatNameForSoloChats,
  getUsersOnlineCount,
  userSent,
  defaultToast,
  TOAST_TYPE,
} from '../../utils/utils';
import { useSocket } from '../../contexts/socket-context';

const ChatPreview = () => {
  const { currentUser } = useAuthentication();
  const {
    activeChat,
    setActiveChat,
    chats,
    windowDimensions,
    setActiveView,
    setNotifications,
    notifications,
    setUnreadMessages,
  } = useChatView();

  const { onlineUsers } = useSocket();

  const handleClick = async e => {
    const element = e.target.closest('.chat-preview-list');
    const chatId = element.getAttribute('name');

    if (!chatId || chatId === activeChat[0]?._id) return;

    if (windowDimensions.width <= 900) {
      setActiveView('chat');
    }

    const newActiveChat = chats.find(chat => chat._id === chatId);
    setActiveChat([newActiveChat]);

    const unreadNotificationsInChat = notifications.filter(
      notification => notification.chat._id === chatId
    );
    console.log(unreadNotificationsInChat);
    setUnreadMessages(unreadNotificationsInChat);

    try {
      const response = await fetch(
        `http://localhost:4000/api/notification/removeNotification`,
        {
          method: 'post',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: newActiveChat._id,
          }),
        }
      );
      const updatedNotifications = await response.json();
      setNotifications(updatedNotifications);
    } catch (error) {
      defaultToast(TOAST_TYPE.error, 'Error updating notifications');
    }
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
