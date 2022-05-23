import { useEffect } from 'react';
import { io } from 'socket.io-client';
import ApplicationView from './components/application-view/application-view.component';
import Header from './components/header/header.component';

function App() {
  // useEffect(() => {
  //   const socket = io();
  // }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <ApplicationView />
      {/* 
      <NavigationBar/>
      <Login/>
      <Sidebar/>
    */}
    </div>
  );
}

export default App;
