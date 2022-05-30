import SendMessage from '../send-message/send-message.component';
import MessageView from '../message-view/message-view.component';
// import TextHeader from '../text-header/text-header.component';
import './chat-view.styles.scss';

const ChatView = () => {
  return (
    <div className="chat-view-container">
      {/* <TextHeader /> */}
      <MessageView />
      <SendMessage />
    </div>
  );
};

export default ChatView;
