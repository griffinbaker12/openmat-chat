import { createContext, useContext, useState } from 'react';

const ConversationsContext = createContext();

export const useConversations = () => useContext(ConversationsContext);

export const ConversationsProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);

  const createConversation = recipients =>
    setConversations(prevState => [...prevState, { recipients, messages: [] }]);

  return (
    <ConversationsContext.Provider
      value={{ conversations, createConversation }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};
