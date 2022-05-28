import { createContext, useContext, useState } from 'react';

const ContactsContext = createContext();

export const useContacts = () => useContext(ContactsContext);

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  const createContact = userName =>
    setContacts(prevState => [...prevState, { userName }]);

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  );
};
