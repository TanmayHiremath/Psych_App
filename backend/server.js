const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;


const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("new room", (roomName) => {
    io.in(roomName).clients((err, clients) => {
      console.log(clients); // an array containing socket ids in roomName
      if (clients.length == 0) {
        socket.join(roomName);
        socket.to(roomName).emit("joined room",)
      }
      else {
        socket.emit("room exists", roomName)
      }
    });

  })
  socket.on("join room", (roomName) => { 
    
   });
  io.in(roomName).clients((err, clients) => {
    console.log(clients); // an array containing socket ids in roomName
    if (clients.length > 0) {
      socket.join(roomName)
    }
    else {
      socket.emit("no room exists", roomName)
    }
  })
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    socket.to(data['roomName']).emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", (data) => {
    socket.to(data['roomName']).emit("notifyStopTyping");
  });

  socket.on("chat message", function (data) {
    console.log("message: " + data['message']);

    //broadcast message to everyone in port:5000 except yourself.
    socket.to(data['roomName']).emit("received", { username: data['username'], message: data['message'] });
  });


  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

})