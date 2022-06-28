import { useEffect, useState } from 'react';
import MessageView from '../message-view/message-view.component';
import TextHeader from '../text-header/text-header.component';
import Spinner from '../spinner/spinner.component';
import { useChatView } from '../../contexts/chat-view-context';
import BackArrow from '../back-arrow/back-arrow.component';
import './chat-view.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';
import { useSocket } from '../../contexts/socket-context';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';

const ChatView = () => {
  const {
    setActiveView,
    setActiveChat,
    activeChat,
    isChatViewLoading,
    activeView,
    windowDimensions,
    chats,
    setNotifications,
  } = useChatView();
  const { currentUser } = useAuthentication();
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleBackArrowClick = () => {
    setActiveView('chat-preview');
    setActiveChat([]);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('msg-received', async message => {
      if (!activeChat[0]?._id || message.chat._id !== activeChat[0]?._id) {
        try {
          const response = await fetch(
            `http://localhost:4000/api/notification/addNotification`,
            {
              method: 'post',
              headers: {
                Authorization: `Bearer ${currentUser?.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message,
                test: 'sloth sloth',
              }),
            }
          );
          const notification = await response.json();
          setNotifications(prevState => [...prevState, notification]);
        } catch (error) {
          defaultToast(TOAST_TYPE.error, 'Error setting notifications');
        }
      } else {
        setIsTyping(false);
        setMessages(prevState => [...prevState, message]);
      }
    });
    return () => socket.off('msg-received');
  }, [
    socket,
    activeChat,
    setNotifications,
    currentUser?.token,
    setMessages,
    setIsTyping,
  ]);

  return (
    <div
      style={
        windowDimensions.width > 900
          ? { width: '68%' }
          : activeView === 'chat'
          ? { width: '100%' }
          : { display: 'none' }
      }
      className={`chat-view-container ${
        activeChat.length > 0 && 'active-chat'
      }`}
    >
      {isChatViewLoading ? (
        <Spinner type="search" />
      ) : activeChat.length > 0 ? (
        <>
          <TextHeader />
          <MessageView
            messages={messages}
            setMessages={setMessages}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
          />
        </>
      ) : (
        <div className="create-or-select-chat-container">
          <p>
            {chats.length === 0
              ? 'Create a chat to get started!'
              : 'Select a chat to view!'}
          </p>
          <div
            style={
              windowDimensions.width > 900
                ? { display: 'none' }
                : { display: 'flex' }
            }
            onClick={handleBackArrowClick}
          >
            <BackArrow arrowType={'body'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;
