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
  const { currentUser } = useAuthentication();

  const updateSearchValue = e => setSearch(e.target.value);

  const handleSearchSubmit = async e => {
    e.preventDefault();
    console.log('hello');
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

    // Fetch logic
  };

  useEffect(() => {
    // Fetch depending on the value in the search for both posts and users
    // fetch('http://localhost:4000/api/user', {
    //   method: 'post',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     email: text.email,
    //     password: text.password,
    //     name: text.name,
    //     picture: picCloudUrl,
    //   }),
  }, [search]);

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
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
