import { toast } from 'react-toastify';

export const generateChatNameForSoloChats = (users, currentUser) =>
  users.filter(user => user._id !== currentUser._id)[0].name;

export const TOAST_TYPE = {
  success: 'success',
  error: 'error',
};

export const defaultToast = (type, message) => {
  if (type === TOAST_TYPE.success) {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  } else {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }
};
