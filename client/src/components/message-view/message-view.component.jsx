import { useConversations } from '../../contexts/conversations-context';
import './message-view.styles.scss';

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { conversations, activeConversation } = useConversations();
  // console.log(conversations[activeConversation].recipients);

  return (
    <div className="message-view-container">
      <div className="message-view-text-container">
        <div className="message-view-text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi, labore
          commodi, quidem dignissimos inventore officiis tenetur, consequatur
          officia quod ipsum amet dolores! Nesciunt accusantium sit est
          excepturi totam quam corporis.
        </div>
      </div>
      <div className="message-view-text-container">
        <div className="message-view-text">
          Lorem ipsum dolor sit, amet consectetur
        </div>
      </div>
      <div className="message-view-text-container">
        <div className="message-view-text">Lorem</div>
      </div>
    </div>
  );
};

export default MessageView;
