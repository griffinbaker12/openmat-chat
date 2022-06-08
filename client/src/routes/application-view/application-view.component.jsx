import SideBar from '../../components/side-bar/side-bar.component';
import ChatView from '../../components/chat-view/chat-view.component';
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
