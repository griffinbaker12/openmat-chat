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

global.onlineUsers = new Map();
io.on('connection', socket => {
  socket.on('setup', userId => {
    socket.join(userId);
    global.onlineUsers.set(userId, socket.id);
    for (const [
      onlineUserId,
      _onlineSocketId,
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

    // Add them to the set when they sign in and emit an event that contains all of the users and can handle this on the client side

    // onlineUsers.set(userId, socket.id);
    // console.log(onlineUsers);
    // for (const [onlineUser, onlineSocket] of global.onlineUsers.entries()) {
    //   //   console.log('online socket', onlineSocket, 'socket', socket.id);
    //   //   socket.to(onlineUser).emit('online users', global.onlineUsers);
    //   socket.emit('user logged in', onlineUser);
    // }
    // // socket.emit('user logged in', userId);
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

  // Take them out of the set
  socket.on('log out', userId => {
    socket.leave(userId);
    console.log('log out running');

    global.onlineUsers.delete(userId);
    for (const [
      onlineUserId,
      _onlineSocketId,
    ] of global.onlineUsers.entries()) {
      socket
        .to(onlineUserId)
        .emit('logged in user change', [...global.onlineUsers]);
    }
  });
});
