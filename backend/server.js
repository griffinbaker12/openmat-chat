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
    console.log('logged in user change', userId);
    global.onlineUsers.set(userId, socket.id);
    console.log(global.onlineUsers);
    for (const [
      onlineUserId,
      _onlineSocketId,
    ] of global.onlineUsers.entries()) {
      console.log('uh');
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

  // socket.off('setup', () => {
  //   onlineUsers.push('yo');
  // });
});

// io.on('connection', socket => {
//   socket.on('setup', userData => {
//     socket.join(userData._id);
//   });

//   socket.on('join chat', chatId => {
//     // console.log('user joined a chat', chatId);
//     socket.join(chatId);
//   });

//   socket.on('typing', (room, user) => {
//     // console.log('user is in these rooms', socket.rooms, room);
//     socket.in(room).emit('typing', user.userName);
//   });

//   socket.on('stop typing', (room, user) =>
//     socket.in(room).emit('stop typing', user.userName)
//   );

//   socket.on('new message', message => {
//     let chat = message.chat;
//     socket.broadcast.emit('message received', message);
//     // chat.users.forEach(user => {
//     //   if (user._id === message.sender._id) return;
//     //   socket.to(user._id).emit('message received', message);
//     // });
//   });

//   // socket.on('new chat', chat => {});
//   socket.on('leave chat', chatId => {
//     // console.log('left', chatId);
//     socket.leave(chatId);
//   });
// });

// global.onlineUsers = new Map();
// global.chatRooms = new Map();
// io.on('connection', socket => {
//   global.chatSocket = socket;
//   socket.on('add-user', userId => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on('send-msg', message => {
//     message.chat.users.forEach(user => {
//       if (user._id === message.sender._id) {
//         console.log('do nothing');
//         return;
//       }
//       const sendUserSocket = onlineUsers.get(user._id);
//       if (sendUserSocket) {
//         console.log('there was a socket');
//         socket.to(sendUserSocket).emit('msg-receive', message);
//       }
//     });
//   });
// });

// db()
//   .then(() => {
//     const server = app.listen(PORT, console.log(`listening on port ${PORT}`));
//     const socketProvider = io(server, {
//       // pingTimeout: 60000,
//       cors: {
//         origin: 'http://localhost:3000',
//       },
//     });
//     socketProvider.on('connection', socket => {
//       console.log('connected to socket.io');

//       socket.on('setup', userData => {
//         socket.join(userData._id);
//         socket.emit('connected');
//       });

//       socket.on('join chat', chatId => {
//         socket.join(chatId);
//         console.log('user joined chat room', chatId);
//       });

//       socket.on('new message', message => {
//         let chat = message.chat;
//         chat.users.forEach((user, i) => {
//           console.log(i);
//           console.log(user._id, message.sender._id);
//           if (user._id === message.sender._id) return;
//           socket.in(user._id).emit('message received', message);
//           console.log('running');
//         });
//       });
//     });
//   })
//   .catch(e => console.log(e));
