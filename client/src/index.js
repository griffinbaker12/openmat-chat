import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './contexts/socket-context';
import { ContactsProvider } from './contexts/contacts-context';
import { ConversationsProvider } from './contexts/conversations-context';
import App from './App';
import './index.css';

// I think I can just make a user provider that wraps the whole app, and then when they sign in, update that value that is then available to all the other components if and when they need it

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <ContactsProvider>
        <ConversationsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  </React.StrictMode>
);
