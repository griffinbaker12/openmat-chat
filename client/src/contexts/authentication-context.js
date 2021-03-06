import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthenticationContext = createContext();

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [activeAuth, setActiveAuth] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  // May want to include different states for whether the sign in or the registration is loading...but fine for now
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changeAuth = () =>
    setActiveAuth(prevState => (prevState === 'login' ? 'register' : 'login'));

  // Something like this, I am not sure if this works 100% but still nonetheless we can clean this up later when we get to it. Then we should also be working on the sign in component which should not be all that bad either

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setIsLoading(true);
      setCurrentUser(userInfo);
    }
    if (!userInfo) navigate('/');
  }, [navigate]);

  return (
    <AuthenticationContext.Provider
      value={{
        activeAuth,
        changeAuth,
        currentUser,
        setCurrentUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
