import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ApplicationView from './routes/application-view/application-view.component';
import Header from './routes/header/header.component';
import Authentication from './routes/authentication/authentication.component';
import { useAuthentication } from './contexts/authentication-context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Obviously need to change and update this when a user actually signs in
// In the real world, this variable will just be updated and set as the current user or something like that and we can receive that when the user signs in and we receive their username! Nice and easy. So then the entire application has access to the current user.
// const currentUser = 'griffinbaker12';

function App() {
  // To include the id in the socket provider once we get DB hooked up

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user) navigate('/chat');
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Authentication />} />
          <Route path="chat" element={<ApplicationView />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
