import { Outlet } from 'react-router-dom';
import Logo from '../../assets/OpenMat.png';
import './header.styles.scss';

const Header = () => {
  return (
    <>
      <div className="header-container">
        <img src={Logo} height="100px" width="100px" alt="open mat logo" />
        <p className="title">OpenMat Chat</p>
      </div>
      <Outlet />
    </>
  );
};

export default Header;
