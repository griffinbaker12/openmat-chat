// const { MongoClient } = require('mongodb');
// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:3001',
//   },
// });

// // // Connect to mongo
// // const url = 'mongodb://localhost:4000';
// // const client = new MongoClient(url);
// // const dbName = 'openMatChat';
// // async function main() {
// //   await client.connect();
// //   console.log('connection successful');
// //   const db = client.db(dbName);
// //   const collection = db.collection('documents');
// //   console.log(collection);

// //   return 'done.';
// // }

// // main()
// //   .then(console.log)
// //   .catch(console.error)
// //   .finally(() => client.close());

// io.on('connection', socket => {
//   // So what he does is create an ID on the client side that stays consistent. I think when we make a new user, we should store them along with the ID and then send it to the client so we can send it here to the server. We need to generate a static id for each client
//   console.log('a user connected');
//   const userName = socket.handshake.query.userName;
//   socket.join(userName);

//   socket.on('send-message', ({ recipients, text }) => {
//     recipients.forEach(recipient => {
//       const newRecipients = recipients.filter(r => r !== recipient);
//       console.log('recip and new recip', recipients, newRecipients);
//       newRecipients.push(userName);
//       socket.broadcast.to(recipient).emit('receive-message', {
//         recipients: newRecipients,
//         sender: userName,
//         text,
//       });
//     });
//   });
// });

// server.listen(3000, () => {
//   console.log('listening on port 3000');
// });

const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// So what I still need to do here is obviously create a new id for each chat that is generated, which I think mongo will be able to produce for me anyway, can store that on the front end, and then send that along here to the BE
app.get('/chat/:id', (req, res) => {
  // console.log(req.params.id);
  const { id } = req.params;
  const chat = [{ id: 12345, participants: ['joe', 'rob', 'steve'] }].find(
    c => c.id === Number(id)
  );
  res.send(chat);
});

const PORT = process.env.port || 4000;

app.listen(PORT, console.log(`listening on port ${PORT}`));
