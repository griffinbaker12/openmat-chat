import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthentication } from './authentication-context';

const ContactsContext = createContext();

export const useContacts = () => useContext(ContactsContext);

export const ContactsProvider = ({ children }) => {
  const { currentUser } = useAuthentication();
  const [activeFriend, setActiveFriend] = useState('');
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFriends(currentUser.friends);
  }, [currentUser]);

  // Also need a route where you can add the friend of a person and check if the id of the person is already there amongst your friends, and if it is then do not send the request
  // const addFriend = userName =>
  //   setFriends(prevState => [...prevState, { userName }]);

  // Whenever you look at the profile of some other user should have a button where you can remove them...

  return (
    <ContactsContext.Provider
      value={{ friends, setFriends, activeFriend, setActiveFriend }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
