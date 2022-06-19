import { useCallback, useEffect, useState } from 'react';
import { useChatView } from '../../contexts/chat-view-context';
import Spinner from '../spinner/spinner.component';
import './message-view.styles.scss';
import { useAuthentication } from '../../contexts/authentication-context';
import { defaultToast, TOAST_TYPE, userSent } from '../../utils/utils';

// Could definitely add timestamp data to the message as well, that would be pretty clean actually

const MessageView = () => {
  // Somehow we are going to have to get all of the message in a conversation potentially and then mark whether or not they are your messages or someone else's to style accordingly;
  const { currentUser } = useAuthentication();
  const { activeChat, windowDimensions } = useChatView();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // So I am thinking that I can definitely scroll into view whatever message is actually clicked within whatever chat, I don't see why that would not be possible?
  // Pretty cool, when the component actually mounts, the ref for the element gets passed into the callback function, could actually do some pretyy coll things with this, like making an animation or shake the screen or bounce the message or anything when the message actually enters the screen...

  const handleKeyDown = async e => {
    const newMessage = e.target.innerHTML;
    if (e.key === 'Enter' && newMessage) {
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
        console.log(message);
        setMessages(prevState => [message, ...prevState]);
      } catch (error) {
        defaultToast(TOAST_TYPE.error, 'Error sending');
      }
    } else {
      return;
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!activeChat) return;
    console.log(activeChat);
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
  }, [activeChat, currentUser.token]);

  // const sendMessage = useCallback(async () => {
  //   console.log('running');
  // }, [newMessage, activeChat, currentUser.token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, activeChat]);

  // useEffect(() => {
  //   sendMessage();
  // }, [sendMessage]);

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

                return (
                  <div
                    key={i}
                    ref={lastMessageBool ? setRef : null}
                    className={`message-view-text-container ${
                      userSentBool ? 'user-sent' : ''
                    }`}
                  >
                    <div className="message-view-text">{message.text}</div>
                    <div className="message-view-text-info">
                      <p>{userSentBool ? 'You' : message.sender.userName}</p>
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
