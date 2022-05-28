import { useConversations } from '../../contexts/conversations-context';
import './text-header.styles.scss';

const TextHeader = () => {
  // If there is an overflow of people in a chat make sure that you either just say + however many more, or you actually allow people to scroll to the right to be able to see
  const { activeConversation } = useConversations();
  console.log(activeConversation);

  return (
    <div className="text-header-container">
      <p className="to-text-recipient">To: </p>
      <div className="recipient-container">
        <h1 className="text-recipient">Griffin Baker</h1>
      </div>
    </div>
  );
};

export default TextHeader;
