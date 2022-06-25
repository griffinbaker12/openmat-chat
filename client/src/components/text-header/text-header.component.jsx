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
  } = useChatView();
  const { currentUser } = useAuthentication();

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
      <p
      // style={
      // windowDimensions.width > 900
      // ? { textAlign: 'left' }
      // : { textAlign: 'center' }
      // }
      >
        {activeChat.length > 0 && !activeChat[0].isGroupChat
          ? generateChatNameForSoloChats(activeChat[0].users, currentUser)
          : activeChat[0].chatName}
      </p>
      <div onClick={handleClick} className="chat-information-button-container">
        <span className="chat-information-button">i</span>
      </div>
    </div>
  );
};

export default TextHeader;
