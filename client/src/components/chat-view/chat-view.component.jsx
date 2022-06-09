import MessageView from '../message-view/message-view.component';
import TextHeader from '../text-header/text-header.component';
import './chat-view.styles.scss';
import { useConversations } from '../../contexts/conversations-context';

const ChatView = () => {
  const { activeChat } = useConversations();

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
