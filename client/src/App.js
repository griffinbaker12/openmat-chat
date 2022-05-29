import { useEffect } from 'react';
import { io } from 'socket.io-client';
import ApplicationView from './components/application-view/application-view.component';
import Header from './components/header/header.component';
import { ContactsProvider } from './contexts/contacts-context';
import { ConversationsProvider } from './contexts/conversations-context';

// Obviously need to change and update this when a user actually signs in
const currentUser = 'griffinbaker12';

function App() {
  // useEffect(() => {
  //   const socket = io();
  // }, []);

  return (
    <ContactsProvider>
      <ConversationsProvider userName={currentUser}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Header />
          <ApplicationView />
          {/* 
      <Login/>
    */}
        </div>
      </ConversationsProvider>
    </ContactsProvider>
  );
}

export default App;
