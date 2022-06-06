import { Outlet } from 'react-router-dom';
import HeaderAuth from '../../components/header-auth/header-auth.component';
import HeaderChat from '../../components/header-chat/header-chat.component';
import Logo from '../../assets/OpenMat.png';
import { useAuthentication } from '../../contexts/authentication-context';

const Header = () => {
  const { currentUser } = useAuthentication();

  return (
    <>
      {!currentUser ? <HeaderAuth logo={Logo} /> : <HeaderChat logo={Logo} />}
      <Outlet />
    </>
  );
};

export default Header;
