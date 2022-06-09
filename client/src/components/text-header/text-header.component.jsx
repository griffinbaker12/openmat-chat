import { useConversations } from '../../contexts/conversations-context';
import './text-header.styles.scss';
import { generateChatNameForSoloChats } from '../../utils/utils';
import { useAuthentication } from '../../contexts/authentication-context';
import { useSidebar, MODAL_TYPE } from '../../contexts/sidebar-context';

const TextHeader = () => {
  const { activeChat } = useConversations();
  const { currentUser } = useAuthentication();
  const { handleModal } = useSidebar();

  console.log(activeChat, 'ac from th');

  const handleClick = () => {
    handleModal(MODAL_TYPE.chatInfo);
  };

  return (
    <div className="text-header-container">
      <p>
        {activeChat && activeChat[0].chatName === 'solo chat'
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
