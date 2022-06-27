import { useEffect, useState } from 'react';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import './side-bar.styles.scss';
import ContactPreview from '../contact-preview/contact-preview.component';
import Spinner from '../spinner/spinner.component';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import { useSocket } from '../../contexts/socket-context';
import { defaultToast, TOAST_TYPE } from '../../utils/utils';

const SideBar = () => {
  const { socket } = useSocket();
  const {
    search,
    isChatViewLoading,
    updateSearchValue,
    handleSearchSubmit,
    handleModal,
    sideBarCategory,
    activeView,
    windowDimensions,
    setChats,
    setReloadCircuit,
    activeChat,
    setActiveChat,
    chats,
  } = useChatView();

  console.log('chats', chats);

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
        console.log('remove flag', removeFlag, 'update flag', updateFlag);
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

        console.log(
          priorChatUserNamesAndId,
          'mpwns',
          updatedChatUserNames,
          'scps'
        );

        console.log('cfd', checkForDuplicate);

        const existingChatUsersAndId = priorChatUserNamesAndId.find(chat => {
          if (chat[0].length !== updatedChatUserNames.length) return false;
          return chat[0].every((user, i) => user === updatedChatUserNames[i]);
        });

        console.log(existingChatUsersAndId, 'existing chat user and id');

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
        setChats(prevState => [updatedChat, ...prevState]);
        defaultToast(TOAST_TYPE.success, 'You have been added to a chat');
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
      <div className="side-bar-search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            onChange={updateSearchValue}
            value={search}
            type="search"
            placeholder="Search conversations and friends ..."
          />
          <SearchIcon className="search-icon" />
        </form>
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
