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

io.on('connection', socket => {
  socket.on('setup', userData => {
    socket.join(userData._id);
  });

  socket.on('join chat', chatId => {
    socket.join(chatId);
  });

  socket.on('typing', (room, user) => {
    socket.in(room).emit('typing', user.userName);
  });

  socket.on('stop typing', room => {
    console.log('typing stopped');
    socket.in(room).emit('stop typing');
  });

  socket.on('new message', message => {
    let chat = message.chat;
    chat.users.forEach(user => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('message received', message);
    });
  });
});

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
