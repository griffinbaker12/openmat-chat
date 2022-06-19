import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import { generateChatNameForSoloChats } from '../../utils/utils';
import BackArrow from '../back-arrow/back-arrow.component';
import './text-header.styles.scss';

const TextHeader = () => {
  const {
    activeChat,
    handleModal,
    setShowActiveUserWithinChatInfo,
    setActiveView,
    windowDimensions,
    setActiveChat,
    chats,
  } = useChatView();
  const { currentUser } = useAuthentication();

  console.log(activeChat, chats);

  const handleClick = () => {
    handleModal(MODAL_TYPE.chatInfo);
    setShowActiveUserWithinChatInfo(false);
  };

  const handleBackArrowClick = () => {
    setActiveView('chat-preview');
    setActiveChat([]);
  };

  return (
    <div className="text-header-container">
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
      <p>
        {activeChat.length > 0 && !activeChat[0].isGroupChat
          ? generateChatNameForSoloChats(activeChat[0].users, currentUser)
          : activeChat[0].chatName}
      </p>
      <div onClick={handleClick} className="chat-information-button-container">
        <button className="chat-information-button">i</button>
      </div>
    </div>
  );
};

export default TextHeader;
