import SideBar from '../side-bar/side-bar.component';
import ChatView from '../chat-view/chat-view.component';
import './application-view.styles.scss';
import { useConversations } from '../../contexts/conversations-context';

const ApplicationView = () => {
  const { activeConversation } = useConversations();

  return (
    <div className="application-view-container">
      <SideBar />
      {activeConversation && <ChatView />}
    </div>
  );
};

export default ApplicationView;
