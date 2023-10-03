const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);

const io = require('socket.io')(server, {
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

const roomCodes = [];

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

app.get('/getRooms', (req, res) => {
  res.send(roomCodes);
});

app.get('/getRoom/:id', (req, res) => {
  const { id } = req.params;
  let joinRoom = false;
  console.log(roomCodes.length, id);
  for (let i = 0; i < roomCodes.length; i++) {
    if (id == roomCodes[i].code) {
      console.log(id);
      joinRoom = true;
    }
  }

  return res.send(joinRoom);
});

app.post('/createRoom', (req, res) => {
  const roomId = generateUniqueRoomId();
  const privateCode = generateUniquePrivateCode();

  roomCodes.push({ id: roomId, code: privateCode });

  console.log(roomId, privateCode);

  return res.json({ id: roomId, code: privateCode });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

module.exports = app;
