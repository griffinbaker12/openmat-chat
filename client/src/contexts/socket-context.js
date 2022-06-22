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

  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io(ENDPOINT);
    newSocket.emit('setup', currentUser._id);
    setSocket(newSocket);
    newSocket.on('logged in user change', users => {
      console.log('logged in user change from client', users);
      const userIdArr = users.map(([userId, socketId]) => userId);
      setOnlineUsers(userIdArr);
    });
    return () => {
      newSocket.off('logged in user change');
      setOnlineUsers(prevState => {
        const newOnlineUsers = prevState.filter(
          user => user !== currentUser?._id
        );
        return newOnlineUsers;
      });
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
