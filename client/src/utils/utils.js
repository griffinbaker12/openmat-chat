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

export const userSent = (currentUser, message) =>
  currentUser._id === message.sender._id;

export const sameSenderAndNotCurrentUser = (i, messages, currentUser) => {
  return (
    i + 1 < messages.length &&
    messages[i].sender._id === messages[i + 1].sender._id &&
    currentUser._id !== messages[i].sender._id
  );
};

export const getTyperString = typers => {
  if (typers.length === 1) return typers[0];
  return typers
    .slice(0, typers.length - 1)
    .join(', ')
    .concat(` and ${typers.at(-1)}`);
};
