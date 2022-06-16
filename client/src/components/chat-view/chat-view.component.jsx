import MessageView from '../message-view/message-view.component';
import TextHeader from '../text-header/text-header.component';
import Spinner from '../spinner/spinner.component';
import { useChatView } from '../../contexts/chat-view-context';
import './chat-view.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';

const ChatView = () => {
  const { activeChat } = useChatView();
  const { isLoading } = useAuthentication();
  console.log(isLoading);

  return (
    <div
      className={`chat-view-container ${
        activeChat.length > 0 && 'active-chat'
      }`}
    >
      {isLoading ? (
        <Spinner type="search" />
      ) : activeChat.length > 0 ? (
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
