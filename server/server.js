// const app = require('express')()
// const http = require('http')
// const { Server } = require('socket.io')
// const cors = require("cors")

// app.use(cors())

// const server = http.createServer(app)

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// })

// app.get('/', function (req, res) {
//   res.send('Hello from the server!')
// })

// const socketID_to_Users_Map = {}
// const roomID_to_Code_Map = {}

// async function getUsersinRoom(roomId, io) {
//   const socketList = await io.in(roomId).allSockets()
//   const userslist = []
//   socketList.forEach((each => {
//     (each in socketID_to_Users_Map) && userslist.push(socketID_to_Users_Map[each].username)
//   }))

//   return userslist
// }

// async function updateUserslistAndCodeMap(io, socket, roomId) {
//   socket.in(roomId).emit("member left", { username: socketID_to_Users_Map[socket.id].username })

//   // update the user list
//   delete socketID_to_Users_Map[socket.id]
//   const userslist = await getUsersinRoom(roomId, io)
//   socket.in(roomId).emit("updating client list", { userslist: userslist })

//   userslist.length === 0 && delete roomID_to_Code_Map[roomId]
// }

// //Whenever someone connects this gets executed
// io.on('connection', function (socket) {
//   console.log('A user connected', socket.id);

//   socket.on("when a user joins", async ({ roomId, username }) => {
//     console.log("username: ", username);
//     socketID_to_Users_Map[socket.id] = { username };
//     socket.join(roomId);

//     const userslist = await getUsersinRoom(roomId, io);

//     // for other users, updating the client list
//     socket.in(roomId).emit("updating client list", { userslist: userslist });

//     // for this user, updating the client list
//     io.to(socket.id).emit("updating client list", { userslist: userslist });

//     // send the latest code changes to this user when joined to existing room
//     if (roomId in roomID_to_Code_Map) {
//       io.to(socket.id).emit("on language change", { languageUsed: roomID_to_Code_Map[roomId].languageUsed });
//       io.to(socket.id).emit("on code change", { code: roomID_to_Code_Map[roomId].code });
//     }

//     // alerting other users in room that new user joined
//     socket.in(roomId).emit("new member joined", {
//       username
//     });
//   });

//   socket.on("timer update", ({ roomId, timerDuration, timerRunning }) => {
//     io.in(roomId).emit("timer update", { timerDuration, timerRunning });
//   });

//   io.on("connection", (socket) => {
//     socket.on("timer update", ({ timerDuration, timerRunning }) => {
//       const roomId = socket.roomId; // Assuming you have roomId stored in the socket
//       socket.to(roomId).emit("timer update", { timerDuration, timerRunning });
//     });
//   });

//   // for other users in room to view the changes
//   socket.on("update language", ({ roomId, languageUsed }) => {
//     if (roomId in roomID_to_Code_Map) {
//       roomID_to_Code_Map[roomId]['languageUsed'] = languageUsed
//     } else {
//       roomID_to_Code_Map[roomId] = { languageUsed }
//     }
//   })

//   // for user editing the code to reflect on his/her screen
//   socket.on("syncing the language", ({ roomId }) => {
//     if (roomId in roomID_to_Code_Map) {
//       socket.in(roomId).emit("on language change", { languageUsed: roomID_to_Code_Map[roomId].languageUsed })
//     }
//   })

//   // for other users in room to view the changes
//   socket.on("update code", ({ roomId, code }) => {
//     if (roomId in roomID_to_Code_Map) {
//       roomID_to_Code_Map[roomId]['code'] = code
//     } else {
//       roomID_to_Code_Map[roomId] = { code }
//     }
//   })

//   // for user editing the code to reflect on his/her screen
//   socket.on("syncing the code", ({ roomId }) => {
//     if (roomId in roomID_to_Code_Map) {
//       socket.in(roomId).emit("on code change", { code: roomID_to_Code_Map[roomId].code })
//     }
//   })

//   socket.on("leave room", ({ roomId }) => {
//     socket.leave(roomId)
//     updateUserslistAndCodeMap(io, socket, roomId)
//   })

//   socket.on("disconnecting", (reason) => {
//     socket.rooms.forEach(eachRoom => {
//       if (eachRoom in roomID_to_Code_Map) {
//         updateUserslistAndCodeMap(io, socket, eachRoom)
//       }
//     })
//   })

//   //Whenever someone disconnects this piece of code executed
//   socket.on('disconnect', function () {
//     console.log('A user disconnected')
//   })
// })

// //you can store your port number in a dotenv file, fetch it from there and store it in PORT
// //we have hard coded the port number here just for convenience
// const PORT = process.env.PORT || 5001

// server.listen(PORT, function () {
//   console.log(`listening on port : ${PORT}`)
// })


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};
const roomID_to_Timer_Map = {};
const roomID_to_Question_Map = {};

async function getUsersinRoom(roomId, io) {
  const socketList = await io.in(roomId).allSockets();
  const userslist = [];
  socketList.forEach((each) => {
    if (each in socketID_to_Users_Map) {
      userslist.push(socketID_to_Users_Map[each].username);
    }
  });
  return userslist;
}

async function updateUserslistAndCodeMap(io, socket, roomId) {
  socket.in(roomId).emit('member left', {
    username: socketID_to_Users_Map[socket.id].username,
  });

  // Update the user list
  delete socketID_to_Users_Map[socket.id];
  const userslist = await getUsersinRoom(roomId, io);
  socket.in(roomId).emit('updating client list', { userslist });

  if (userslist.length === 0) {
    delete roomID_to_Code_Map[roomId];
    delete roomID_to_Timer_Map[roomId];
    delete roomID_to_Question_Map[roomId];
  }
}

// Whenever someone connects this gets executed
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('when a user joins', async ({ roomId, username }) => {
    console.log('username: ', username);
    socketID_to_Users_Map[socket.id] = { username };
    socket.join(roomId);

    const userslist = await getUsersinRoom(roomId, io);

    // For other users, updating the client list
    socket.in(roomId).emit('updating client list', { userslist });

    // For this user, updating the client list
    io.to(socket.id).emit('updating client list', { userslist });

    // Send the latest code changes to this user when joined to existing room
    if (roomId in roomID_to_Code_Map) {
      io.to(socket.id).emit('on language change', {
        languageUsed: roomID_to_Code_Map[roomId].languageUsed,
      });
      io.to(socket.id).emit('on code change', { code: roomID_to_Code_Map[roomId].code });
    }

    // Send the latest timer state to this user when joined to existing room
    if (roomId in roomID_to_Timer_Map) {
      io.to(socket.id).emit('timer update', {
        timerDuration: roomID_to_Timer_Map[roomId].duration,
        timerRunning: roomID_to_Timer_Map[roomId].running,
      });
    }

    // Send the latest question to this user when joined to existing room
    if (roomId in roomID_to_Question_Map) {
      io.to(socket.id).emit('room question', {
        question: roomID_to_Question_Map[roomId],
      });
    }

    // Alerting other users in room that new user joined
    socket.in(roomId).emit('new member joined', { username });
  });

  // Timer update handling
  socket.on('timer update', ({ roomId, timerDuration, timerRunning }) => {
    roomID_to_Timer_Map[roomId] = {
      duration: timerDuration,
      running: timerRunning,
    };
    io.in(roomId).emit('timer update', { timerDuration, timerRunning });
  });

  // Question update handling
  socket.on('question update', ({ roomId, question }) => {
    roomID_to_Question_Map[roomId] = question;
    io.in(roomId).emit('room question', { question });
  });

  // For other users in room to view the changes
  socket.on('update language', ({ roomId, languageUsed }) => {
    if (roomId in roomID_to_Code_Map) {
      roomID_to_Code_Map[roomId].languageUsed = languageUsed;
    } else {
      roomID_to_Code_Map[roomId] = { languageUsed };
    }
  });

  // For user editing the code to reflect on his/her screen
  socket.on('syncing the language', ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket.in(roomId).emit('on language change', {
        languageUsed: roomID_to_Code_Map[roomId].languageUsed,
      });
    }
  });

  // For other users in room to view the changes
  socket.on('update code', ({ roomId, code }) => {
    if (roomId in roomID_to_Code_Map) {
      roomID_to_Code_Map[roomId].code = code;
    } else {
      roomID_to_Code_Map[roomId] = { code };
    }
  });

  // For user editing the code to reflect on his/her screen
  socket.on('syncing the code', ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket.in(roomId).emit('on code change', { code: roomID_to_Code_Map[roomId].code });
    }
  });

  socket.on('leave room', ({ roomId }) => {
    socket.leave(roomId);
    updateUserslistAndCodeMap(io, socket, roomId);
  });

  socket.on('disconnecting', (reason) => {
    socket.rooms.forEach((eachRoom) => {
      if (eachRoom in roomID_to_Code_Map) {
        updateUserslistAndCodeMap(io, socket, eachRoom);
      }
    });
  });

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
