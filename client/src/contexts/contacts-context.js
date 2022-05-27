import { createContext, useContext, useState } from 'react';

const ContactsContext = createContext();

export const useContacts = () => useContext(ContactsContext);

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  const createContact = username =>
    setContacts(prevState => [...prevState, { username }]);

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
};
