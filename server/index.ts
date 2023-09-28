const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const roomCodes: any = {};

const generateRandomString = (length: any) => {
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

app.post('/createRoom', (req: any, res: any) => {
  const roomId = generateUniqueRoomId();
  const privateCode = generateUniquePrivateCode();

  roomCodes[roomId] = privateCode;

  res.json({ roomId, privateCode });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
