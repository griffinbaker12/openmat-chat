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

  console.log('online users', onlineUsers, 'current user', currentUser);

  useEffect(() => {
    if (!currentUser) return;
    const newSocket = io(ENDPOINT);
    newSocket.emit('setup', currentUser._id);
    // newSocket.on('user logged in', user => {
    //   console.log('someone logged in');
    //   setOnlineUsers(prevState => [...prevState, user]);
    // });
    setSocket(newSocket);
    return () => {
      newSocket.off('online users');
      newSocket.off('user logged in');
      newSocket.close();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
