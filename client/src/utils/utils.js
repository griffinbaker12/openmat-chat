export const generateChatNameForSoloChats = (users, currentUser) =>
  users.filter(user => user._id !== currentUser._id)[0].name;
