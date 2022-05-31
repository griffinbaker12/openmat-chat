import { createContext, useContext, useState } from 'react';

const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [activeAuth, setActiveAuth] = useState('login');

  const changeAuth = () =>
    setActiveAuth(prevState => (prevState === 'login' ? 'register' : 'login'));

  return (
    <AuthenticationContext.Provider value={{ activeAuth, changeAuth }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
