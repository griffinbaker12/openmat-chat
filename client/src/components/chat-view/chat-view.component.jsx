import MessageView from '../message-view/message-view.component';
import TextHeader from '../text-header/text-header.component';
import Spinner from '../spinner/spinner.component';
import { useChatView } from '../../contexts/chat-view-context';
import BackArrow from '../back-arrow/back-arrow.component';
import './chat-view.styles.scss';

const ChatView = () => {
  const {
    setActiveView,
    setActiveChat,
    activeChat,
    isChatViewLoading,
    activeView,
    windowDimensions,
    chats,
  } = useChatView();

  const handleBackArrowClick = () => {
    setActiveView('chat-preview');
    setActiveChat([]);
  };

  return (
    <div
      style={
        windowDimensions.width > 900
          ? { width: '68%' }
          : activeView === 'chat'
          ? { width: '100%' }
          : { display: 'none' }
      }
      className={`chat-view-container ${
        activeChat.length > 0 && 'active-chat'
      }`}
    >
      {isChatViewLoading ? (
        <Spinner type="search" />
      ) : activeChat.length > 0 ? (
        <>
          <TextHeader />
          <MessageView />
        </>
      ) : (
        <div className="create-or-select-chat-container">
          <p>
            {chats.length === 0
              ? 'Create a chat to get started!'
              : 'Select a chat to view!'}
          </p>
          <div
            style={
              windowDimensions.width > 900
                ? { display: 'none' }
                : { display: 'flex' }
            }
            onClick={handleBackArrowClick}
          >
            <BackArrow />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;
