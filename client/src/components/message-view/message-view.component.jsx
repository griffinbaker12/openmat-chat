import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useChatView } from '../../contexts/chat-view-context';
import Spinner from '../spinner/spinner.component';
import './message-view.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';
import {
  defaultToast,
  sameSenderAndNotCurrentUser,
  TOAST_TYPE,
  userSent,
} from '../../utils/utils';

// Could definitely add timestamp data to the message as well, that would be pretty clean actually

const ENDPOINT = 'http://localhost:4000';
let socket, selectedChatCompare;

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { currentUser } = useAuthentication();
  const { activeChat, windowDimensions } = useChatView();

  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // So I am thinking that I can definitely scroll into view whatever message is actually clicked within whatever chat, I don't see why that would not be possible?
  // Pretty cool, when the component actually mounts, the ref for the element gets passed into the callback function, could actually do some pretyy coll things with this, like making an animation or shake the screen or bounce the message or anything when the message actually enters the screen...

  const handleKeyDown = async e => {
    const newMessage = e.target.innerHTML;
    if (e.key === 'Enter' && newMessage) {
      console.log(newMessage);
      e.preventDefault();
      e.target.innerHTML = '';
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
        socket.emit('new message', message);
        setMessages(prevState => [...prevState, message]);
      } catch (error) {
        defaultToast(TOAST_TYPE.error, 'Error sending');
      }
    } else {
      return;
    }
  };

  const fetchMessages = useCallback(async () => {
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

    console.log('one person joined the chag');
    socket.emit('join chat', activeChat[0]._id);
  }, [activeChat, currentUser.token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, activeChat]);

  useEffect(() => {
    console.log('heyyyadsfjhsadfhljk');
    socket = io(ENDPOINT);
    socket.emit('setup', currentUser);
    socket.on('connected', () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    console.log('aright wrf bto');
    socket.on('message received', message => {
      console.log('the message is', message);
      if (!activeChat[0]._id || message.chat._id !== activeChat[0]._id) {
        // give notification
        console.log('fail some how');
      } else {
        setMessages(prevState => [...prevState, message]);
      }
    });
  }, []);

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

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
