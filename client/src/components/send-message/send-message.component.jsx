import './send-message.styles.scss';

const SendMessage = () => {
  // Make this a controlled component so that you can clear the text of the message button after hitting send and then add it up top in the sample text section.

  return (
    <div className="send-message-container">
      <textarea className="send-input" />
      <button className="send-button" type="button">
        Send
      </button>
    </div>
  );
};

export default SendMessage;
