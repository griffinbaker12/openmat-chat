import './header-auth.styles.scss';

const HeaderAuth = ({ logo }) => {
  return (
    <div className="header-auth-container">
      <div className="header-auth-logo-container">
        <img src={logo} height="100%" width="auto" alt="open mat logo" />
      </div>
      <p className="header-auth-title">OpenMat Chat</p>
    </div>
  );
};

export default HeaderAuth;
