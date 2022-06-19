import { useEffect, useState } from 'react';
import SideBar from '../../components/side-bar/side-bar.component';
import ChatView from '../../components/chat-view/chat-view.component';
import Modal from '../../components/modal/modal.component';
import './application-view.styles.scss';
import { useChatView } from '../../contexts/chat-view-context';

const ApplicationView = () => {
  const {
    setWindowDimensions,
    windowDimensions,
    setActiveView,
    setActiveChat,
    chats,
    activeChat,
  } = useChatView();

  const handleResize = e => {
    const height = e.target.innerHeight;
    const width = e.target.innerWidth;
    setWindowDimensions({ height, width });
    if (windowDimensions.width > 900) {
      setActiveView('chat');
      //   if (activeChat.length) {
      //     setActiveChat([chats[0]]);
      //   } else {
      //     setActiveChat([]);
    }
    // }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
