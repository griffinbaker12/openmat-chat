import { useCallback, useEffect, useState } from 'react';
import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-preview.styles.scss';
import { generateChatNameForSoloChats } from '../../utils/utils';

const ChatPreview = () => {
  // And then we can also pull the active conversation up into higher state or into a context just so that we can actually store this variable without losing it when we switch between categories b/c that triggers a re-render
  const { currentUser } = useAuthentication();
  const { activeChat, setActiveChat, chats, setChats } = useChatView();

  const handleClick = e => {
    const chatId = e.target.getAttribute('name');

    // Clicked on the container and not one of the list items, did not want to add the event handler to each individual item
    if (!chatId) return;

    const activeChat = chats.find(chat => chat._id === chatId);
    setActiveChat([activeChat]);
  };

  // Also going to need a map down below where I map over all of the data that I am pulling in and then add the class to the right; could also do a name function as well where you get the name off of the element that was clicked and then set it to the active one

  // This is wrong right now, but I know how to solve it. For each conversation, you need to make one UL or div or whatever and then each person of that convo you add in, then display flex that

  // Will also need to add in the image container and the name of the chat

  return (
    <div className="chat-preview-container" onClick={handleClick}>
      {chats.length > 0 &&
        activeChat[0] &&
        chats.map(({ _id, chatName, users }) => (
          <div
            key={_id}
            name={_id}
            className={`chat-preview-list ${
              _id === activeChat[0]?._id ? 'active' : ''
            }`}
          >
            {!activeChat[0].isGroupChat
              ? generateChatNameForSoloChats(users, currentUser)
              : chatName}
          </div>
        ))}
    </div>
  );
};

export default ChatPreview;
