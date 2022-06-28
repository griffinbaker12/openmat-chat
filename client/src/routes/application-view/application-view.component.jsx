import { useEffect } from 'react';
import SideBar from '../../components/side-bar/side-bar.component';
import ChatView from '../../components/chat-view/chat-view.component';
import Modal from '../../components/modal/modal.component';
import './application-view.styles.scss';
import { useChatView } from '../../contexts/chat-view-context';

const ApplicationView = () => {
  const { setWindowDimensions, windowDimensions, setActiveView } =
    useChatView();

  const handleResize = e => {
    const height = e.target.innerHeight;
    const width = e.target.innerWidth;
    setWindowDimensions({ height, width });
    if (windowDimensions.width > 900) {
      setActiveView('chat');
    }
  };

  // const handleUnload = () => {
  //   console.log('handleUnload');
  //   socket.emit('log out', currentUser._id);
  // };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('resize', handleResize);
      // window.removeEventListener('beforeunload', handleUnload);
    };
  });

  return (
    <div className="application-view-container">
      <SideBar />
      <ChatView />
      <Modal />
    </div>
  );
};

export default ApplicationView;
