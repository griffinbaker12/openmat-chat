import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthentication } from './authentication-context';
import { useChatView } from './chat-view-context';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const ENDPOINT = 'http://localhost:4000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { currentUser } = useAuthentication();

  console.log('online users', onlineUsers);

  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io(ENDPOINT);
    newSocket.emit('setup', currentUser._id);
    newSocket.on('logged in user change', users => {
      const userIdArr = users.map(([userId, socketId]) => userId);
      setOnlineUsers(userIdArr);
    });
    setSocket(newSocket);
    return () => {
      newSocket.off('logged in user change');
      newSocket.emit('log out', currentUser._id);
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
