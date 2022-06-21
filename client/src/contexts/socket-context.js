import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthentication } from './authentication-context';
import { useChatView } from './chat-view-context';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const ENDPOINT = 'http://localhost:4000';

export const SocketProvider = ({ userName, children }) => {
  const [socket, setSocket] = useState();

  const { activeChat } = useChatView();
  const { currentUser } = useAuthentication();

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [currentUser, activeChat]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
