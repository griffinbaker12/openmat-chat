import { useState } from 'react';
import Login from '../../components/login/login.component';
import './authentication.styles.scss';

const Authentication = () => {
  const [activeAuth, setActiveAuth] = useState('login');

  return <>{activeAuth === 'login' ? <Login /> : ''}</>;
};

export default Authentication;
