import { toast } from 'react-toastify';

export const generateChatNameForSoloChats = (users, currentUser) => {
  // console.log(
  //   'the users and current user from function are',
  //   users,
  //   currentUser
  // );
  return users.filter(user => user._id !== currentUser._id)[0].name;
};

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
    toast.error(message, {
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

export const getMutualFriends = (friendOneArr, friendTwoArr) => {
  let count = 0;
  friendOneArr.forEach(friendOne => {
    friendTwoArr.forEach(friendTwo => {
      if (friendOne.userName === friendTwo.userName) {
        count++;
      }
    });
  });
  return count;
};

export const areFriends = (user1, user2) => {
  return user1.friends.some(friend => friend.userName === user2.userName);
};
