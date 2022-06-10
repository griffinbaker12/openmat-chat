import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthenticationProvider } from './contexts/authentication-context';
import { ChatViewProvider } from './contexts/chat-view-context';
import { SocketProvider } from './contexts/socket-context';

// I think I can just make a user provider that wraps the whole app, and then when they sign in, update that value that is then available to all the other components if and when they need it

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthenticationProvider>
        <SocketProvider>
          <ChatViewProvider>
            <App />
          </ChatViewProvider>
        </SocketProvider>
      </AuthenticationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
