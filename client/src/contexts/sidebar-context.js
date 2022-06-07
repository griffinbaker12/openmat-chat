import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthentication } from './authentication-context';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SIDEBAR_CATEGORY_TYPE = {
  conversations: 'conversations',
  friends: 'friends',
};

export const SidebarProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [sideBarCategory, setSideBarCategory] = useState(
    SIDEBAR_CATEGORY_TYPE.conversations
  );
  const [showModal, setShowModal] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuthentication();

  const updateSearchValue = e => setSearch(e.target.value);

  const fetchChats = async () => {
    try {
      console.log('running');
      const response = await fetch(`http://localhost:4000/api/chat`, {
        method: 'get',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await response.json();
      setChats(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearchSubmit = async e => {
    e.preventDefault();
    if (!search) return;

    // Spinner until you get the results, fetch them

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
      console.log(e, 'Failed to load search results');
    }
  };

  // Fetch the chats once, and then otherwise just add the chats to the data, don't need to re-fetch or anything like that. Could keep this here or do something where you only fetch the chats and the friends once the user is actually signed in. That could also be a route where you just find these two things

  useEffect(() => {
    if (currentUser._id) {
      fetchChats();
    }
    return;
  }, [currentUser]);

  return (
    <SidebarContext.Provider
      value={{
        search,
        updateSearchValue,
        isLoading,
        searchResults,
        sideBarCategory,
        setSideBarCategory,
        setIsLoading,
        setSearchResults,
        showModal,
        setShowModal,
        handleSearchSubmit,
        chats,
        setChats,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
