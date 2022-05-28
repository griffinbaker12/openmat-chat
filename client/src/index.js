import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ContactsProvider } from './contexts/contacts-context';
import { ConversationsProvider } from './contexts/conversations-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContactsProvider>
      <ConversationsProvider>
        <App />
      </ConversationsProvider>
    </ContactsProvider>
  </React.StrictMode>
);
