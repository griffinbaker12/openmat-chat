import { useConversations } from '../../contexts/conversations-context';
import './text-header.styles.scss';
import { generateChatNameForSoloChats } from '../../utils/utils';
import { useAuthentication } from '../../contexts/authentication-context';

const TextHeader = () => {
  // If there is an overflow of people in a chat make sure that you either just say + however many more, or you actually allow people to scroll to the right to be able to see
  const { activeChat } = useConversations();
  const { currentUser } = useAuthentication();
  console.log(activeChat, 'from header');

  return (
    <div className="text-header-container">
      <p>{generateChatNameForSoloChats(activeChat[0].users, currentUser)}</p>
      <div className="chat-information-button-container">
        <button className="chat-information-button">i</button>
      </div>
    </div>
  );
};

export default TextHeader;
