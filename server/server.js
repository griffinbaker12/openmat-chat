const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3001',
  },
});

// // Connect to mongo
// const url = 'mongodb://localhost:4000';
// const client = new MongoClient(url);
// const dbName = 'openMatChat';
// async function main() {
//   await client.connect();
//   console.log('connection successful');
//   const db = client.db(dbName);
//   const collection = db.collection('documents');
//   console.log(collection);

//   return 'done.';
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

io.on('connection', socket => {
  // So what he does is create an ID on the client side that stays consistent. I think when we make a new user, we should store them along with the ID and then send it to the client so we can send it here to the server. We need to generate a static id for each client
  console.log('a user connected');
  const userName = socket.handshake.query.userName;
  socket.join(userName);

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient);
      console.log('recip and new recip', recipients, newRecipients);
      newRecipients.push(userName);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: userName,
        text,
      });
    });
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});
