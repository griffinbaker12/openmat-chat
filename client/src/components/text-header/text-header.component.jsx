import { useAuthentication } from '../../contexts/authentication-context';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import { generateChatNameForSoloChats } from '../../utils/utils';
import './text-header.styles.scss';

const TextHeader = () => {
  const { activeChat, handleModal } = useChatView();
  const { currentUser } = useAuthentication();
  console.log(activeChat[0].isGroupChat);

  const handleClick = () => {
    handleModal(MODAL_TYPE.chatInfo);
  };

  return (
    <div className="text-header-container">
      <p>
        {activeChat && !activeChat[0].isGroupChat
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
