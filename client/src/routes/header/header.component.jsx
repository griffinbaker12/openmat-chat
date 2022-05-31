import { Outlet } from 'react-router-dom';
import Logo from '../../assets/OpenMat.png';
import './header.styles.scss';

const Header = () => {
  return (
    <>
      <div className="header-container">
        <div className="logo-container">
          <img src={Logo} height="100%" width="auto" alt="open mat logo" />
        </div>
        <p className="title">OpenMat Chat</p>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
