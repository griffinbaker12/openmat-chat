import { createContext, useContext, useState } from 'react';

const ConversationsContext = createContext();

export const useConversations = () => useContext(ConversationsContext);

export const ConversationsProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState('');

  const createConversation = recipients =>
    setConversations(prevState => [...prevState, { recipients, messages: [] }]);

  const setConversation = conversationAttribute =>
    setActiveConversation(conversationAttribute);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        createConversation,
        activeConversation,
        setConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};
