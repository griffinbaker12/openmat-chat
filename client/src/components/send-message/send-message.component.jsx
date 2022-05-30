import { useRef } from 'react';
import { useConversations } from '../../contexts/conversations-context';
import './send-message.styles.scss';

const SendMessage = () => {
  // Make this a controlled component so that you can clear the text of the message button after hitting send and then add it up top in the sample text section.
  const { currentConversation, sendMessage } = useConversations();
  const inputRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    if (!inputRef.current.value) return;

    const timeMsgSent = new Date().toLocaleTimeString().split('');
    timeMsgSent.splice(4, 3).join();

    sendMessage(
      currentConversation.recipients,
      inputRef.current.value,
      timeMsgSent
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
