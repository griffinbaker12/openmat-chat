import { useConversations } from '../../contexts/conversations-context';
import './text-header.styles.scss';

const TextHeader = () => {
  // If there is an overflow of people in a chat make sure that you either just say + however many more, or you actually allow people to scroll to the right to be able to see
  const { activeConversation, conversations } = useConversations();

  return (
    <div className="text-header-container">
      <p className="to-text-recipient">To: </p>
      <div className="recipient-container">
        {conversations[activeConversation].recipients.map((recipient, i) => (
          <div key={i} className="text-recipient">
            {recipient.userName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextHeader;
