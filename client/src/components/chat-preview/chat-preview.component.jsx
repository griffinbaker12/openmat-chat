import { useCallback, useEffect, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-preview.styles.scss';
import {
  generateChatNameForSoloChats,
  getUsersOnlineCount,
} from '../../utils/utils';
import { useSocket } from '../../contexts/socket-context';

const ChatPreview = () => {
  // And then we can also pull the active conversation up into higher state or into a context just so that we can actually store this variable without losing it when we switch between categories b/c that triggers a re-render
  const { currentUser } = useAuthentication();
  const { activeChat, setActiveChat, chats, windowDimensions, setActiveView } =
    useChatView();

  const { onlineUsers } = useSocket();

  const handleClick = e => {
    const chatId = e.target.getAttribute('name');

    // Clicked on the container and not one of the list items, did not want to add the event handler to each individual item
    if (!chatId) return;

    if (windowDimensions.width <= 900) {
      setActiveView('chat');
    }

    const activeChat = chats.find(chat => chat._id === chatId);
    setActiveChat([activeChat]);
  };

  return (
    <div className="chat-preview-container" onClick={handleClick}>
      {chats.length > 0 &&
        activeChat[0] &&
        chats.map(({ _id, chatName, users, isGroupChat }) => {
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
                <div className="chat-preview-list-item-name-and-online">
                  <p>
                    {!isGroupChat
                      ? generateChatNameForSoloChats(users, currentUser)
                      : chatName}
                  </p>
                  {userOnlineCount > 0 ? (
                    <div className="chat-preview-list-circle-and-count-container">
                      <div className="online-circle" />
                      <div>
                        {userOnlineCount === 1 && !isGroupChat
                          ? 'Online'
                          : `${userOnlineCount} Online`}
                      </div>
                    </div>
                  ) : (
                    <div className="chat-preview-list-circle-and-count-container">
                      <div className="offline-circle" />
                      <div> {!isGroupChat ? 'Offline' : `0 Online`}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChatPreview;
