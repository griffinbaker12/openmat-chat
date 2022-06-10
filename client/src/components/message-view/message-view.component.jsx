import SendMessage from '../send-message/send-message.component';
import { useCallback } from 'react';
import { useChatView } from '../../contexts/chat-view-context';
import './message-view.styles.scss';

// Could definitely add timestamp data to the message as well, that would be pretty clean actually

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { activeChat } = useChatView();

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  // What is the best way to make it so that the text bubble can expland if it needs to??
  return (
    <div className="message-view-container">
      <div className="message-view-active-chat-container">
        {activeChat.messages?.map((message, i) => {
          const lastMessageBool = activeChat.messages.length - 1 === i + 1;
          return (
            <div
              key={i}
              ref={lastMessageBool ? setRef : null}
              className={`message-view-text-container ${
                message.userSent ? 'user-sent' : ''
              }`}
            >
              <div className="message-view-text">{message.text}</div>
              <div className="message-view-text-info">
                <p>{message.userSent ? 'You' : message.sender}</p>
                <span>&#x2022;</span>
                <p>{message.timeStamp}</p>
              </div>
            </div>
          );
        })}
      </div>
      <SendMessage />
    </div>
  );
};

export default MessageView;
