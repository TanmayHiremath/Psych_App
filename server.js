import { randomWord } from './words'
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;


const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);



io.on("connection", (socket) => {

  console.log("user connected");


  socket.on("new room", (data) => { //send username and roomName in data
    new_room()
  });

  function new_room(){
    let random_word = randomWord()
    io.in(random_word).clients((err, clients) => {
      console.log('clients.length:'+clients.length); // an array containing socket ids in roomName
      if (clients.length == 0) {
        socket.join(random_word);
        socket.emit('room created', { roomName: random_word })
      }
      else {
        new_room()
      }
    });
  }

  socket.on("join room", (data) => {
    io.in(data['roomName']).clients((err, clients) => {
      if (clients.length > 0) {
        socket.join(data['roomName']);
        joined_room(data)
      }
      else {
        socket.emit("no room exists", { roomName: data['roomName'] })
      }
    });
  });
  function joined_room(data) {
    socket.to(data['roomName']).emit("joined room", { username: data['username'], roomName: data['roomName'] });
  }




  socket.on("typing", (data) => {
    socket.to(data['roomName']).emit("notifyTyping", { user: data.user, roomName: data['roomName'] });
  });


  socket.on("stopTyping", (data) => {
    socket.to(data['roomName']).emit("notifyStopTyping");
  });

  socket.on("chat message", function (data) {

    io.in(data['roomName']).clients((err, clients) => {
      console.log(clients);
    });
    console.log(data['username'] + " : " + data['message'] + " in room: " + data['roomName']);
    socket.to(data['roomName']).emit("received", { username: data['username'], message: data['message'], roomName: data['roomName'] });
  });


  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);



  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
})