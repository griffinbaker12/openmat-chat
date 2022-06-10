import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuthentication } from './authentication-context';
import { toast } from 'react-toastify';
// import { useSocket } from './socket-context';

const ChatViewContext = createContext();

export const useChatView = () => useContext(ChatViewContext);

export const SIDEBAR_CATEGORY_TYPE = {
  conversations: 'conversations',
  friends: 'friends',
};

export const MODAL_TYPE = {
  sidebar: 'sidebar',
  chatInfo: 'chatInfo',
};

export const ChatViewProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [sideBarCategory, setSideBarCategory] = useState(
    SIDEBAR_CATEGORY_TYPE.conversations
  );
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [chats, setChats] = useState([]);
  const [activeFriend, setActiveFriend] = useState('');
  const [friends, setFriends] = useState([]);

  const { currentUser } = useAuthentication();

  const updateSearchValue = e => setSearch(e.target.value);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat`, {
        method: 'get',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await response.json();

      setChats(data);
    } catch (e) {
      toast.error('Error fetching chats', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }, [currentUser]);

  const handleModal = (modalType, friendId = null) => {
    // Not sure what I was thinking for this as of right now
    // If the friend has not changed, do not do this loop
    // const friend = friends.find(friend => friend._id === friendId);
    // setActiveFriend(friend);

    setModalType(modalType);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSearchSubmit = async e => {
    e.preventDefault();
    if (!search) return;

    try {
      setIsLoading(true);

      // I almost like the feature where you keep the search text there so that you know what you searched, and then once you hit the x then the results unfilter and are based off of the time the last message was sent
      // setSearch('');

      const response = await fetch(
        `http://localhost:4000/api/user?search=${search}`,
        {
          method: 'get',
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      const { messages, users } = await response.json();
      setIsLoading(false);
      setSearchResults([{ messages, users }]);
    } catch (e) {
      toast.error('Error fetching results', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  // Fetch the chats once, and then otherwise just add the chats to the data, don't need to re-fetch or anything like that. Could keep this here or do something where you only fetch the chats and the friends once the user is actually signed in. That could also be a route where you just find these two things

  useEffect(() => {
    // Make sure that that is right?
    if (!currentUser) return;
    if (currentUser._id) {
      fetchChats();
    }
    return;
  }, [currentUser, fetchChats]);

  useEffect(() => {
    if (chats.length === 0) return;
    else {
      const activeChat = chats[0];
      setActiveChat([activeChat]);
    }
  }, [chats]);

  useEffect(() => {
    if (!currentUser) return;
    setFriends(currentUser.friends);
  }, [currentUser]);

  return (
    <ChatViewContext.Provider
      value={{
        activeChat,
        setActiveChat,
        handleModal,
        closeModal,
        handleSearchSubmit,
        updateSearchValue,
        chats,
        setChats,
        showModal,
        setSideBarCategory,
        sideBarCategory,
        modalType,
      }}
    >
      {children}
    </ChatViewContext.Provider>
  );
};
