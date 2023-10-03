const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const roomCodes = {};

const generateRandomString = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateUniqueRoomId = () => {
  const timestamp = Date.now().toString(36);
  const randomString = generateRandomString(4);
  return `${timestamp}_${randomString}`;
};

const generateUniquePrivateCode = () => {
  return generateRandomString(4);
};

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId, privateCode) => {
    if (roomCodes[roomId] && roomCodes[roomId] === privateCode) {
      socket.join(roomId);
      socket.emit('joinedRoom', roomId);
    } else {
      socket.emit('invalidCode', 'Invalid Code');
    }
  });
});

app.get('/', (req, res) => {
  return res.send('hush-app-server API');
});

app.post('/createRoom', (req, res) => {
  const roomId = generateUniqueRoomId();
  const privateCode = generateUniquePrivateCode();

  roomCodes[roomId] = privateCode;

  console.log(roomId, privateCode);

  return res.json({ id: roomId, code: privateCode });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

module.exports = app;
