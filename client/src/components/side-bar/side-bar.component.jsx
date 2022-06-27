import { useEffect } from 'react';
// import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import './side-bar.styles.scss';
import ContactPreview from '../contact-preview/contact-preview.component';
import Spinner from '../spinner/spinner.component';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import { useSocket } from '../../contexts/socket-context';

const SideBar = () => {
  const { socket } = useSocket();
  const {
    isChatViewLoading,
    handleModal,
    sideBarCategory,
    activeView,
    windowDimensions,
    setChats,
    setReloadCircuit,
    activeChat,
    setActiveChat,
    chats,
    searchResults,
  } = useChatView();

  console.log(searchResults);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      'updated chat',
      (
        updatedChat,
        removeFlag = null,
        updateFlag = null,
        checkForDuplicate = null
      ) => {
        setReloadCircuit(true);

        if (!removeFlag && !updateFlag) {
          setChats(prevState => {
            const arr = prevState.map(chat => {
              if (chat._id === updatedChat._id) {
                return updatedChat;
              } else return chat;
            });
            return arr;
          });
          return;
        }

        if (removeFlag) {
          setChats(prevState => {
            return prevState.filter(chat => chat._id !== updatedChat._id);
          });
          return;
        }

        const priorChatUserNamesAndId = chats.map(chat => [
          chat.users.map(({ userName }) => userName).sort(),
          chat._id,
        ]);

        const updatedChatUserNames = [...updatedChat.users]
          .map(user => user.userName)
          .sort();

        const existingChatUsersAndId = priorChatUserNamesAndId.find(chat => {
          if (chat[0].length !== updatedChatUserNames.length) return false;
          return chat[0].every((user, i) => user === updatedChatUserNames[i]);
        });

        if (existingChatUsersAndId && checkForDuplicate) {
          const existingChat = chats.find(
            chat => chat._id === existingChatUsersAndId[1]
          );
          setActiveChat([existingChat]);
          setChats(prevState => {
            return prevState.filter(chat => chat._id !== updatedChat._id);
          });
          return;
        }

        if (
          updateFlag &&
          activeChat[0] &&
          updatedChat._id === activeChat[0]._id
        ) {
          setActiveChat([updatedChat]);
          setChats(prevState => {
            const arr = prevState.map(chat => {
              if (chat._id === updatedChat._id) {
                return updatedChat;
              } else return chat;
            });
            return arr;
          });
          return;
        } else if (
          updateFlag &&
          chats.some(chat => chat._id === updatedChat._id)
        ) {
          setChats(prevState => {
            const arr = prevState.map(chat => {
              if (chat._id === updatedChat._id) {
                return updatedChat;
              } else return chat;
            });
            return arr;
          });
          return;
        }
      }
    );
    return () => socket.off('updated chat');
  }, [socket, setChats, setReloadCircuit, activeChat, setActiveChat, chats]);

  useEffect(() => {
    if (!socket) return;
    socket.on('chat creation', newChat => {
      setReloadCircuit(true);
      setChats(prevState => [newChat, ...prevState]);
    });
    return () => socket.off('chat creation');
  }, [socket, setChats, setReloadCircuit]);

  return (
    <div
      style={
        windowDimensions.width > 900
          ? { width: '31%' }
          : activeView === 'chat-preview'
          ? { width: '100%' }
          : { display: 'none' }
      }
      className="side-bar-container"
    >
      <div className="side-bar-header-title-container">
        <p>My Chats</p>
      </div>

      <div style={{ flex: '1' }}>
        <ChatPreview />
        {isChatViewLoading ? <Spinner type="search" /> : <ContactPreview />}
      </div>

      <button
        className="side-bar-container-generate-button"
        onClick={() => handleModal(MODAL_TYPE.sidebar)}
        type="button"
      >
        {sideBarCategory === 'conversations'
          ? 'New Conversation'
          : 'Add Friend'}
      </button>
    </div>
  );
};

export default SideBar;
