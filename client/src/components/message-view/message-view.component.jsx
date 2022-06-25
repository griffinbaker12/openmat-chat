import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Lottie from 'lottie-react';
import { useChatView } from '../../contexts/chat-view-context';
import Spinner from '../spinner/spinner.component';
import './message-view.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';
import animationData from '../../animations/typing.json';
import {
  defaultToast,
  sameSenderAndNotCurrentUser,
  TOAST_TYPE,
  userSent,
  getTyperString,
} from '../../utils/utils';
import { useSocket } from '../../contexts/socket-context';

// Could definitely add timestamp data to the message as well, that would be pretty clean actually

let typingTimer;

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { currentUser } = useAuthentication();
  const { activeChat, setNotifications, setReloadCircuit } = useChatView();
  const { socket } = useSocket();

  // const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typers, setTypers] = useState([]);

  // console.log('typers from outside', typers);

  // So I am thinking that I can definitely scroll into view whatever message is actually clicked within whatever chat, I don't see why that would not be possible?
  // Pretty cool, when the component actually mounts, the ref for the element gets passed into the callback function, could actually do some pretyy coll things with this, like making an animation or shake the screen or bounce the message or anything when the message actually enters the screen...

  const handleKeyDown = async e => {
    if (!socket) return;
    const newMessage = e.target.innerHTML;
    if (e.key === 'Enter' && newMessage) {
      e.preventDefault();
      e.target.innerHTML = '';
      setReloadCircuit(true);
      try {
        const response = await fetch(`http://localhost:4000/api/message`, {
          method: 'post',
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: activeChat[0]._id,
            text: newMessage,
          }),
        });
        const message = await response.json();
        socket.emit('send-msg', message);
        setMessages(prevState => [...prevState, message]);
        setTyping(false);
        socket.emit('chat update', message.chat);
        return;
      } catch (error) {
        defaultToast(TOAST_TYPE.error, 'Error sending');
      }
    } else {
      if (!typing) {
        setTyping(true);
        socket.emit('typing', activeChat[0]._id, currentUser);
      }
      const lastTypingTime = new Date().getTime();
      const timerLength = 3000;
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength) {
          socket.emit('stop typing', activeChat[0]._id, currentUser);
          setTyping(false);
        }
      }, timerLength);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!socket) return;
    if (!activeChat) return;
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:4000/api/message/${activeChat[0]._id}`,
      {
        method: 'get',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }
    );
    const messages = await response.json();
    setMessages(messages);
    setIsLoading(false);
  }, [activeChat, currentUser.token, socket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, activeChat]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join room', activeChat[0]._id);
    socket.emit('stop typing', activeChat[0]._id, currentUser);
    return () => socket.emit('leave room', activeChat[0]._id);
  }, [activeChat, socket, currentUser]);

  useEffect(() => {
    if (!socket) return;
    socket.on('msg-received', message => {
      if (!activeChat[0]._id || message.chat._id !== activeChat[0]._id) {
        setNotifications(prevState => [message, ...prevState]);
        return;
      } else {
        setIsTyping(false);
        setMessages(prevState => [...prevState, message]);
      }
    });
    return () => socket.off('msg-received');
  }, [socket, activeChat, setNotifications]);

  useEffect(() => {
    if (!socket) return;
    socket.on('typing', typer => {
      setIsTyping(true);
      setTypers(prevState => [...new Set([typer, ...prevState])]);
    });
    socket.on('stop typing', userName => {
      const usersStillTyping = typers.filter(typer => typer !== userName);
      if (usersStillTyping.length > 0 && typers.length !== 0) {
        setIsTyping(true);
        setTypers(usersStillTyping);
        return;
      }
      setIsTyping(false);
      setTypers([]);
    });
    return () => {
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [socket, typers]);
  const setRef = useCallback(
    node => {
      if (node && isTyping && isScrolledIntoView(node)) {
        node.scrollIntoView({ smooth: true });
      } else if (node && !isTyping) {
        node.scrollIntoView({ smooth: true });
      }
    },
    [isTyping]
  );

  function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }
  // What is the best way to make it so that the text bubble can expland if it needs to??
  return (
    <div className="message-view-container">
      {isLoading ? (
        <Spinner type="search" />
      ) : (
        <>
          <div className="message-view-active-chat-container">
            {messages.length > 0 &&
              messages.map((message, i) => {
                const lastMessageBool = messages.length - 1 === i + 1;
                const userSentBool = userSent(currentUser, message);
                const sameSenderAndNotCurrentUserBool =
                  sameSenderAndNotCurrentUser(i, messages, currentUser);
                return (
                  <div
                    key={i}
                    ref={lastMessageBool ? setRef : null}
                    style={i === 0 ? { paddingTop: '6px' } : {}}
                    className={`message-view-message-container ${
                      userSentBool ? 'user-sent' : ''
                    }`}
                  >
                    <div
                      className="message-view-message-image-container"
                      style={
                        sameSenderAndNotCurrentUserBool || userSentBool
                          ? { visibility: 'hidden' }
                          : { marginTop: '2px' }
                      }
                    >
                      <img
                        height="100%"
                        src={message.sender.picture}
                        alt="profile"
                      />
                    </div>
                    <div className="message-view-text-container">
                      <div className="message-view-text">{message.text}</div>
                      <div
                        style={
                          sameSenderAndNotCurrentUserBool || userSentBool
                            ? { display: 'none' }
                            : {}
                        }
                        className="message-view-text-info"
                      >
                        <p>
                          @{!userSentBool ? message.sender.userName : 'You'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {isTyping && (
            <div className="lottie-container">
              {typers.length ? getTyperString(typers) : ''}
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ height: '16px', display: 'block' }}
              />
            </div>
          )}

          <div
            className="send-message-editable"
            data-text={`Message `}
            contentEditable
            onKeyDown={handleKeyDown}
          />
        </>
      )}
    </div>
  );
};

export default MessageView;
