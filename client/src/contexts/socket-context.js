import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthentication } from './authentication-context';
import { useChatView } from './chat-view-context';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const ENDPOINT = 'http://localhost:4000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  const { currentUser } = useAuthentication();

  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io(ENDPOINT);
    newSocket.emit('setup', currentUser._id);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
