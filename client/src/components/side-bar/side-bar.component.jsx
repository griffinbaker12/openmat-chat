import { useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import ChatPreview from '../chat-preview/chat-preview.component';
import './side-bar.styles.scss';
import ContactPreview from '../contact-preview/contact-preview.component';
import Spinner from '../spinner/spinner.component';
import { useChatView, MODAL_TYPE } from '../../contexts/chat-view-context';
import { useSocket } from '../../contexts/socket-context';
// import { useAuthentication } from '../../contexts/authentication-context';

// Can extract the useEffect functionality to search for whatever it is that we need to search for in the actual context itself where the data lives / is stored

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
  } = useChatView();

  useEffect(() => {
    if (!socket) return;
    socket.on('updated chat', updatedChat => {
      console.log('does this even get the message?');
      setReloadCircuit(true);
      console.log(updatedChat, 'server return');
      setChats(prevState => {
        return prevState.map(chat => {
          if (chat._id !== updatedChat._id) return chat;
          else return updatedChat;
        });
      });
    });
    return () => socket.off('updated chat');
  }, [socket, setChats, setReloadCircuit]);

  // const handleCategoryChange = e => {
  //   const clickedCategory = e.target.getAttribute('name');
  //   setSideBarCategory(clickedCategory);
  // };

  // submit just get whatever that value was and actually set the search loading to true and all that jazz

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
        {sideBarCategory === 'conversations' ? (
          isChatViewLoading ? (
            <Spinner type="search" />
          ) : (
            <ChatPreview />
          )
        ) : isChatViewLoading ? (
          <Spinner type="search" />
        ) : (
          <ContactPreview />
        )}
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
