import ApplicationView from './components/application-view/application-view.component';
import Header from './components/header/header.component';
import { ContactsProvider } from './contexts/contacts-context';
import { ConversationsProvider } from './contexts/conversations-context';
import { SocketProvider } from './contexts/socket-context';

// Obviously need to change and update this when a user actually signs in
// In the real world, this variable will just be updated and set as the current user or something like that and we can receive that when the user signs in and we receive their username! Nice and easy. So then the entire application has access to the current user.
const currentUser = 'griffinbaker12';

function App() {
  // useEffect(() => {
  //   const socket = io();
  // }, []);

  // To include the id in the socket provider once we get DB hooked up

  return (
    <SocketProvider userName={currentUser}>
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
    </SocketProvider>
  );
}

export default App;
