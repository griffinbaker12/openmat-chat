import MessageView from '../message-view/message-view.component';
import TextHeader from '../text-header/text-header.component';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-view.styles.scss';

const ChatView = () => {
  const { activeChat } = useChatView();

  return (
    <div
      className={`chat-view-container ${
        activeChat.length > 0 && 'active-chat'
      }`}
    >
      {activeChat.length > 0 ? (
        <>
          <TextHeader />
          <MessageView />
        </>
      ) : (
        <p>Create a chat to get started!</p>
      )}
    </div>
  );
};

export default ChatView;
