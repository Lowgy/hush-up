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

const getGameTypeChallenges = (gameType, rounds) => {
  return 'nothing right now';
};

const gameRooms = [];

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomId, privateCode, userName) => {
    let foundRoom = false;
    for (let i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].id === roomId && gameRooms[i].code === privateCode) {
        const { user } = addUser({
          id: socket.id,
          name: userName,
          room: roomId,
        });
        foundRoom = true;
        socket.join(roomId);
        socket.emit('joinedRoom');
        setTimeout(() => {
          io.to(roomId).emit('roomData', {
            room: roomId,
            users: getUsersInRoom(roomId),
          });
        }, 500);
      }
    }
    if (!foundRoom) {
      socket.emit('invalidCode', 'Invalid Code');
    }
  });

  socket.on('startTimer', (roomId) => {
    for (let i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].id === roomId) {
        let countdown = 10;
        const countdownInterval = setInterval(() => {
          if (countdown > 0) {
            io.to(roomId).emit('countdownUpdate', countdown);
            countdown--;
          } else {
            clearInterval(countdownInterval);
            io.to(roomId).emit('countdownComplete');
          }
        }, 1000);
      }
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} disconnected.`,
      });
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
