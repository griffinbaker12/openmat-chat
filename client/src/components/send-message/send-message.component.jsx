import { useRef } from 'react';
import { useConversations } from '../../contexts/conversations-context';
import './send-message.styles.scss';

const SendMessage = () => {
  // Make this a controlled component so that you can clear the text of the message button after hitting send and then add it up top in the sample text section.
  const { conversations, activeConversation, sendMessage } = useConversations();
  console.log(conversations[activeConversation]);
  const inputRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    sendMessage(
      conversations[activeConversation].recipients.map(
        recipient => recipient.userName
      ),
      inputRef.current.value
    );

    inputRef.current.value = '';
  };

  return (
    <div className="send-message-container">
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} placeholder="Message" />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
