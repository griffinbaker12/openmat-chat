const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// const path = require('path');

dotenv.config();
db();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname1, '..', '/client/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => {
//     console.log('app is running successfully');
//   });
// }

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
    const onlineUserIdArr = [...global.onlineUsers.values()];
    if (!onlineUserIdArr.includes(userId)) {
      global.onlineUsers.set(socket.id, userId);
    }
    console.log('online users', global.onlineUsers);
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

  socket.on(
    'chat update',
    (chat, currentUser = null, removeFlag = null, updateFlag = null) => {
      let userId;
      if (!currentUser) {
        userId = chat.latestMessage.sender._id;
      } else {
        userId = currentUser._id;
      }

      if (!removeFlag && !updateFlag) {
        chat.users.forEach(user => {
          if (user._id === userId) {
            socket.emit('updated chat', chat);
          } else {
            socket.to(user._id).emit('updated chat', chat);
          }
        });
      } else if (updateFlag && !removeFlag) {
        chat.users.forEach(user => {
          if (user._id === userId) {
            socket.emit('updated chat', chat, null, updateFlag);
          } else {
            socket.to(user._id).emit('updated chat', chat, null, updateFlag);
          }
        });
      } else if (updateFlag && removeFlag) {
        chat.users.forEach(user => {
          socket
            .to(user._id)
            .emit('updated chat', chat, null, updateFlag, true);
        });
        socket.emit('updated chat', chat, true);
      } else {
        chat.users.forEach(user => {
          if (user._id === userId) {
            socket.emit('updated chat', chat, null, true);
          } else {
            socket.to(user._id).emit('updated chat', chat, null, true);
          }
        });
      }
    }
  );

  socket.on('new chat', (chat, currentUser) => {
    chat.users.forEach(user => {
      if (user._id === currentUser._id) return;
      socket.to(user._id).emit('chat creation', chat);
    });
  });

  socket.on('log out', (userId, loggedOutSocketId) => {
    socket.leave(userId);
    console.log(loggedOutSocketId, 'the logged out socket id');
    global.onlineUsers.delete(loggedOutSocketId);
    console.log('the online users', global.onlineUsers);
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
