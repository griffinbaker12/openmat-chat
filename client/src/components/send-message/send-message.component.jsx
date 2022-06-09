import { useRef, useState } from 'react';
import { useConversations } from '../../contexts/conversations-context';
import './send-message.styles.scss';

const SendMessage = () => {
  const [text, setText] = useState('');
  const formRef = useRef();

  // Make this a controlled component so that you can clear the text of the message button after hitting send and then add it up top in the sample text section.
  // const { currentConversation, sendMessage } = useConversations();
  // const inputRef = useRef();

  const handleSubmit = () => {
    setText('');
  };

  const handleTextChange = e => setText(e.target.value);

  const handleKeyPress = e => {
    if (e.code !== 'Enter') return;
    e.preventDefault();
    formRef.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );

    // console.log('hello?');
    // e.preventDefault();
    // // if (!inputRef.current.value) return;
    // // It would actually be pretty tough as well to update all the messages when a new day occurs, or how many days ago, and have that update live, that is not easy to do. The date itself would be easy, but how many days ago...not so much
    // const timeMsgSent = new Date().toLocaleTimeString().split('');
    // timeMsgSent.splice(5, 3).join();
    // sendMessage(
    //   currentConversation.recipients,
    //   // inputRef.current.value,
    //   timeMsgSent
    // );
    // inputRef.current.value = '';
  };

  return (
    <div className="send-message-container">
      <form onSubmit={handleSubmit} ref={formRef} onKeyPress={handleKeyPress}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Message"
        ></textarea>
      </form>
    </div>
  );
};

export default SendMessage;
