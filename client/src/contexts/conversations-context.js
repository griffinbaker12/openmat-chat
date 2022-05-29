import { createContext, useContext, useState } from 'react';

const ConversationsContext = createContext();

export const useConversations = () => useContext(ConversationsContext);

export const ConversationsProvider = ({ userName, children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState();

  // I feel like here you almost need an id to recognize what chat it is so that you can access this from the other component?

  const createConversation = recipients =>
    setConversations(prevState => [...prevState, { recipients, messages: [] }]);

  const setConversation = conversationAttribute =>
    setActiveConversation(conversationAttribute);
  // On this object, you almost want the recipients, and the messages

  const addMessageToConversation = ({ recipients, text, sender }) => {
    setConversations(prevState => {
      console.log(prevState);
    });
  };

  const sendMessage = (recipients, text) => {
    addMessageToConversation({ recipients, text, sender: userName });
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        createConversation,
        activeConversation,
        setConversation,
        sendMessage,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};
