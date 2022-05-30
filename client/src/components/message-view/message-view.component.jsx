import { useConversations } from '../../contexts/conversations-context';
import './message-view.styles.scss';

// Could definitely add timestamp data to the message as well, that would be pretty clean actually

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { currentConversation } = useConversations();

  // What is the best way to make it so that the text bubble can expland if it needs to??
  return (
    <div className="message-view-container">
      {currentConversation.messages.map((message, i) => (
        <div
          className={`message-view-text-container ${
            message.userSent ? 'user-sent' : ''
          }`}
        >
          <div key={i} className="message-view-text">
            {message.text}
          </div>
          <div className="message-view-text-info">
            <p>{message.userSent ? 'You' : message.sender}</p>
            <span>&#x2022;</span>
            <p>{message.timeStamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageView;
