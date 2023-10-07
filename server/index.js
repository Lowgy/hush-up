const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const gameRooms = [];

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
  socket.on('joinRoom', (roomId, privateCode, userName) => {
    let foundRoom = false;
    for (let i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].id === roomId && gameRooms[i].code === privateCode) {
        console.log(
          `User ${userName} joined ${roomId} with code ${privateCode}`
        );
        foundRoom = true;
        socket.join(roomId);
        socket.emit('joinedRoom');
      }
    }
    if (!foundRoom) {
      socket.emit('invalidCode', 'Invalid Code');
    }
  });
});

app.get('/', (req, res) => {
  return res.send('hush-app-server API');
});

app.get('/getRooms', (req, res) => {
  res.send(gameRooms);
});

app.get('/joinRoom/:id', (req, res) => {
  const { id } = req.params;
  let joinRoom = false;
  let roomId = '';
  console.log(gameRooms.length, id);
  for (let i = 0; i < gameRooms.length; i++) {
    if (id == gameRooms[i].code) {
      joinRoom = true;
      roomId = gameRooms[i];
    }
  }

  return res.send({ roomInfo: roomId, canJoin: joinRoom });
});

app.post('/createRoom', (req, res) => {
  const roomId = generateUniqueRoomId();
  const privateCode = generateUniquePrivateCode();

  gameRooms.push({
    id: roomId,
    code: privateCode,
    rounds: req.body.rounds,
    gameType: req.body.gameType,
  });

  return res.json({
    id: roomId,
    code: privateCode,
    rounds: req.body.rounds,
    gameType: req.body.gameType,
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

module.exports = app;
