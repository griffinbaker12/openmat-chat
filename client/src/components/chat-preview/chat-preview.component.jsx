import { useState } from 'react';
import { useConversations } from '../../contexts/conversations-context';
import './chat-preview.styles.scss';

const ChatPreview = () => {
  // And then we can also pull the active conversation up into higher state or into a context just so that we can actually store this variable without losing it when we switch between categories b/c that triggers a re-render
  const { conversations, activeConversation, setConversation } =
    useConversations();

  console.log('conversations from chat-preview', conversations);

  const handleClick = e => setConversation(e.target.getAttribute('name'));
  // Need to create 2 components, one for the friends view and one for the convo preview view
  // Also going to need a map down below where I map over all of the data that I am pulling in and then add the class to the right; could also do a name function as well where you get the name off of the element that was clicked and then set it to the active one

  // This is wrong right now, but I know how to solve it. For each conversation, you need to make one UL or div or whatever and then each person of that convo you add in, then display flex that
  return (
    <div className="chat-preview-container" onClick={handleClick}>
      {conversations.length > 0 &&
        conversations.map((conversation, id) => (
          <div
            key={id}
            name={id}
            className={`chat-preview-list ${
              activeConversation === `${id}` ? 'active' : ''
            }`}
          >
            {conversation.recipients.map(recipient => recipient).join(', ')}
          </div>
        ))}
    </div>
  );
};

export default ChatPreview;
