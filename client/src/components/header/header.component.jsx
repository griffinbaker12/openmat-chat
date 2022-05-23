import { ReactComponent as OpenMat } from '../../assets/OpenMat.svg';
import Logo from '../../assets/OpenMat.png';
import './header.styles.scss';

const Header = () => {
  return (
    <div className="header-container">
      <img src={Logo} height="100px" width="100px" alt="open mat logo" />
      <p className="title">OpenMat Chat</p>
      {/* <button className="login-link" href="#">
        Login
      </button> */}
    </div>
  );
};

export default Header;
