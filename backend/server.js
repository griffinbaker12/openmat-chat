const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
db();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.port || 4000;

const server = app.listen(PORT, console.log(`running on port ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

// global.loggedInUserId;
global.onlineUsers = new Map();
io.on('connection', socket => {
  socket.on('setup', userId => {
    socket.join(userId);
    const onlineUserIdArr = [...global.onlineUsers.values()];
    if (!onlineUserIdArr.includes(userId)) {
      global.onlineUsers.set(socket.id, userId);
    }
    for (const [
      _onlineSocketId,
      onlineUserId,
    ] of global.onlineUsers.entries()) {
      if (onlineUserId === userId) {
        socket.emit('logged in user change', [...global.onlineUsers]);
        return;
      } else {
        socket
          .to(onlineUserId)
          .emit('logged in user change', [...global.onlineUsers]);
      }
    }
  });

  socket.on('join room', chatId => {
    socket.join(chatId);
  });

  socket.on('leave room', chatId => {
    socket.leave(chatId);
  });

  socket.on('send-msg', message => {
    message.chat.users.forEach(user => {
      if (user._id === message.sender._id) return;
      socket.to(user._id).emit('msg-received', message);
    });
  });

  socket.on('typing', (room, user) => {
    socket.to(room).emit('typing', user.userName);
  });

  socket.on('stop typing', (room, user) =>
    socket.to(room).emit('stop typing', user.userName)
  );

  // Need to do something similar up top where I send the update to all of the people in the chat when there is a new message so that it can show in the chat view, as well as if they need to update the users or the name of the chat REGARDLESS of which chat is currently being viewed
  socket.on('chat update', (chat, currentUser = null, removeFlag = null) => {
    let userId;
    if (!currentUser) {
      userId = chat.latestMessage.sender._id;
    } else {
      userId = currentUser._id;
    }
    chat.users.forEach(user => {
      if (user._id === currentUser._id) {
        socket.emit('updated chat', chat);
      } else {
        socket.to(user._id).emit('updated chat', chat);
      }
    });

    if (removeFlag) {
      socket.emit('updated chat', chat, true);
    }
  });

  socket.on('new chat', (chat, currentUser) => {
    chat.users.forEach(user => {
      if (user._id === currentUser._id) return;
      socket.to(user._id).emit('chat creation', chat);
    });
  });

  socket.on('log out', userId => {
    socket.leave(userId);
    global.onlineUsers.delete(socket.id);
    for (const [
      _onlineSocketId,
      onlineUserId,
    ] of global.onlineUsers.entries()) {
      socket
        .to(onlineUserId)
        .emit('logged in user change', [...global.onlineUsers]);
    }
  });

  socket.on('disconnect', () => {
    global.onlineUsers.delete(socket.id);
    for (const [
      _onlineSocketId,
      onlineUserId,
    ] of global.onlineUsers.entries()) {
      socket
        .to(onlineUserId)
        .emit('logged in user change', [...global.onlineUsers]);
    }
  });
});
