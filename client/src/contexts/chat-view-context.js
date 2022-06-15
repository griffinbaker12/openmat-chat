import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuthentication } from './authentication-context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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
  userInfo: 'userInfo',
};

export const ChatViewProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState([]);
  const [search, setSearch] = useState('');
  const [isChatViewLoading, setIsChatViewLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [sideBarCategory, setSideBarCategory] = useState(
    SIDEBAR_CATEGORY_TYPE.conversations
  );
  const [showModal, setShowModal] = useState(false);
  const [showAddUserInfoDropdown, setShowAddUserInfoDropdown] = useState(false);
  const [modalType, setModalType] = useState('');
  const [chats, setChats] = useState([]);
  const [activeUserInfo, setActiveUserInfo] = useState('');
  const [isActiveUserCurrentUser, setIsActiveUserCurrentUser] = useState(false);
  const [friends, setFriends] = useState([]);

  const { currentUser, setCurrentUser, setIsLoading } = useAuthentication();
  const navigate = useNavigate();

  const closeModal = () => {
    if (showAddUserInfoDropdown) {
      setShowAddUserInfoDropdown(false);
      return;
    }
    setShowModal(false);
  };

  const setUserInfoModal = async (id, currentUserFlag = null) => {
    if (currentUserFlag) {
      setActiveUserInfo(currentUser);
      setIsActiveUserCurrentUser(true);
      return;
    }
    const response = await fetch(
      `http://localhost:4000/api/user/getUserInfo?id=${id}`,
      {
        method: 'get',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }
    );
    const user = await response.json();
    console.log(user);
    setActiveUserInfo(user);
  };

  const updateSearchValue = e => setSearch(e.target.value);

  const fetchChats = useCallback(
    async (tokenForLogin = null, userData = null) => {
      try {
        const response = await fetch(`http://localhost:4000/api/chat`, {
          method: 'get',
          headers: {
            Authorization: `Bearer ${tokenForLogin || currentUser.token}`,
          },
        });
        const data = await response.json();
        setChats(data);
        if (tokenForLogin) {
          navigate('/chat');
          setIsLoading(false);
          toast.success('Login success', {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
          setCurrentUser(userData);
        }
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
    },
    [currentUser, navigate, setIsLoading, setCurrentUser]
  );

  const handleModal = (modalType, userId = null) => {
    setModalType(modalType);
    setShowModal(true);
  };

  const handleSearchSubmit = async e => {
    e.preventDefault();
    if (!search) return;

    try {
      setIsChatViewLoading(true);

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
      setIsChatViewLoading(false);
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
    if (!currentUser) {
      setChats([]);
      setActiveChat([]);
      return;
    }
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
        fetchChats,
        setShowModal,
        showAddUserInfoDropdown,
        setShowAddUserInfoDropdown,
        setUserInfoModal,
        activeUserInfo,
        isActiveUserCurrentUser,
        setIsActiveUserCurrentUser,
      }}
    >
      {children}
    </ChatViewContext.Provider>
  );
};
