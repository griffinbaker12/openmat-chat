import { useCallback, useRef } from 'react';
import { useConversations } from '../../contexts/conversations-context';
import './send-message.styles.scss';

const SendMessage = () => {
  // Make this a controlled component so that you can clear the text of the message button after hitting send and then add it up top in the sample text section.
  const { currentConversation, sendMessage } = useConversations();
  const inputRef = useRef();

  const handleSubmit = e => {
    e.preventDefault();
    if (!inputRef.current.value) return;

    // It would actually be pretty tough as well to update all the messages when a new day occurs, or how many days ago, and have that update live, that is not easy to do. The date itself would be easy, but how many days ago...not so much

    const timeMsgSent = new Date().toLocaleTimeString().split('');
    timeMsgSent.splice(5, 3).join();

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
