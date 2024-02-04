const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const challenges = require('./challenges.json');

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

const getGameTypeChallenges = (gameType) => {
  const gameTypeChallenges = [];
  for (let i = 0; i < challenges.length; i++) {
    if (challenges[i].name.toLowerCase() === gameType) {
      for (let j = 0; j < challenges[i].challenges.length; j++) {
        gameTypeChallenges.push(challenges[i].challenges[j]);
      }
    }
  }
  return gameTypeChallenges;
};

let gameRooms = [];

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

  socket.on('getRoles', (roomId) => {
    let users = getUsersInRoom(roomId);
    const roles = ['safe', 'not safe'];
    let randomRoles = [];
    for (let i = 0; i < users.length; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const temp = users[i];
      users[i] = users[randomIndex];
      users[randomIndex] = temp;
      if (i === 0) {
        randomRoles.push(roles[1]);
      } else {
        randomRoles.push(roles[0]);
      }
    }
    for (let i = 0; i < users.length; i++) {
      io.to(users[i].id).emit('roles', randomRoles[i]);
    }
    io.to(roomId).emit('flipCards');
  });

  socket.on('getChallenges', (roomId, gameType, rounds) => {
    const challenges = getGameTypeChallenges(gameType, rounds);
    io.to(roomId).emit('challenges', challenges);
    const randomChallenge = Math.floor(Math.random() * challenges.length);
    io.to(roomId).emit('randomChallenge', challenges[randomChallenge]);
  });

  socket.on('leverPulled', (roomId) => {
    io.to(roomId).emit('leverPulled');
  });

  socket.on('continueGame', (roomId) => {
    io.to(roomId).emit('continueGame');
  });

  socket.on('startVote', (roomId) => {
    io.to(roomId).emit('startVote');
    for (let i = 0; i < gameRooms.length; i++) {
      if (gameRooms[i].id === roomId) {
        gameRooms[i].votes = { passed: 0, failed: 0, totalVotes: 0 };
      }
    }
  });

  socket.on('vote', (roomId, vote) => {
    const users = getUsersInRoom(roomId);
    //get room index
    const roomIndex = gameRooms.findIndex((room) => room.id === roomId);
    console.log(gameRooms[roomIndex].rounds);
    gameRooms[roomIndex].votes.totalVotes++;
    if (
      gameRooms[roomIndex].votes.totalVote !== users.length - 1 ||
      users.length - 1 === 1
    ) {
      if (vote === 'passed') {
        gameRooms[roomIndex].votes.passed++;
      }
      if (vote === 'failed') {
        gameRooms[roomIndex].votes.failed++;
      }
    }
    if (gameRooms[roomIndex].votes.totalVotes === users.length - 1) {
      if (
        gameRooms[roomIndex].votes.passed > gameRooms[roomIndex].votes.failed
      ) {
        gameRooms[roomIndex].rounds--;
        io.to(roomId).emit('votePassed', gameRooms[roomIndex]);
      } else {
        gameRooms[roomIndex].rounds--;
        io.to(roomId).emit('voteFailed', gameRooms[roomIndex]);
      }
    }
    io.to(roomId).emit('vote', gameRooms[roomIndex].votes);
  });

  socket.on('voteTimerEnded', (roomId) => {
    const roomIndex = gameRooms.findIndex((room) => room.id === roomId);
    console.log(gameRooms[roomIndex].rounds);
    gameRooms[roomIndex].rounds--;
    if (gameRooms[roomIndex].votes.passed > gameRooms[roomIndex].votes.failed) {
      io.to(roomId).emit('votePassed', gameRooms[roomIndex]);
    } else if (
      gameRooms[roomIndex].votes.failed > gameRooms[roomIndex].votes.passed
    ) {
      io.to(roomId).emit('voteFailed', gameRooms[roomIndex]);
    } else {
      io.to(roomId).emit('voteTied', gameRooms[roomIndex]);
    }
  });

  socket.on('nextRound', (roomId) => {
    io.to(roomId).emit('nextRound');
  });

  socket.on('endGame', (roomId) => {
    io.to(roomId).emit('endGame');
    gameRooms = gameRooms.filter((room) => room.id !== roomId);
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
