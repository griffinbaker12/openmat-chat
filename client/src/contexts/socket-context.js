import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userName, children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io('http://localhost:3000', { query: { userName } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [userName]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
