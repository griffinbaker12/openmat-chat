import SideBar from '../side-bar/side-bar.component';
import ChatView from '../chat-view/chat-view.component';
import './application-view.styles.scss';

const ApplicationView = () => {
  return (
    <div className="application-view-container">
      <SideBar />
      <ChatView />
    </div>
  );
};

export default ApplicationView;
