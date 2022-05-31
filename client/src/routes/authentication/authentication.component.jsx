import Login from '../../components/login/login.component';
import Register from '../../components/register/register.component';
import { useAuthentication } from '../../contexts/authentication-context';
import './authentication.styles.scss';

const Authentication = () => {
  const { activeAuth } = useAuthentication();

  return <>{activeAuth === 'login' ? <Login /> : <Register />}</>;
};

export default Authentication;
