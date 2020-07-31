const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;


const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);




io.on("connection", (socket) => {
  var rooms_leaving=[];
  console.log("user connected");


  socket.on("new room", (data) => { //send username and roomName in data
    new_room()
  });

  function new_room() {
    let random_word = randomWord()
    io.in(random_word).clients((err, clients) => {
      console.log('clients.length:' + clients.length); // an array containing socket ids in roomName
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

  socket.on('disconnecting', () => {
    rooms_leaving = socket.rooms
    // the rooms array contains at least the socket ID
  });

  socket.on("disconnect", () => {
    rooms_leaving.forEach(x => {
      socket.to(x).emit("disconnected", { username: data['username'], roomName: data['roomName'] });
    })
    console.log("user disconnected");
  });

  function randomWord() {
    const word1 = ['angle', 'ant', 'apple', 'arch', 'arm', 'army', 'baby', 'bag', 'ball', 'band', 'basin', 'basket', 'bath', 'bed', 'bee', 'bell', 'berry', 'bird', 'blade', 'board', 'boat', 'bone', 'book', 'boot', 'bottle', 'box', 'boy', 'brain', 'branch', 'brick', 'bridge', 'brush', 'bucket', 'bulb', 'button', 'cake', 'camera', 'card', 'cart', 'carriage', 'cat', 'chain', 'cheese', 'chest', 'chin', 'church', 'circle', 'clock', 'cloud', 'coat', 'collar', 'comb', 'cord', 'cow', 'cup', 'curtain', 'cushion', 'dog', 'door', 'drain', 'drawer', 'dress', 'drop', 'ear', 'egg', 'engine', 'eye', 'face', 'farm', 'feather', 'finger', 'fish', 'flag', 'floor', 'fly', 'foot', 'fork', 'fowl', 'frame', 'garden', 'girl', 'glove', 'goat', 'gun', 'hair', 'hammer', 'hand', 'hat', 'head', 'heart', 'hook', 'horn', 'horse', 'hospital', 'house', 'island', 'jewel', 'kettle', 'key']
    const word2 = ['knee', 'knife', 'knot', 'leaf', 'leg', 'library', 'line', 'lip', 'lock', 'map', 'match', 'monkey', 'moon', 'mouth', 'muscle', 'nail', 'neck', 'needle', 'nerve', 'net', 'nose', 'nut', 'office', 'orange', 'oven', 'parcel', 'pen', 'pencil', 'picture', 'pig', 'pin', 'pipe', 'plane', 'plate', 'plough', 'pocket', 'pot', 'potato', 'prison', 'pump', 'rail', 'rat', 'receipt', 'ring', 'rod', 'roof', 'root', 'sail', 'school', 'scissors', 'screw', 'seed', 'sheep', 'shelf', 'ship', 'shirt', 'shoe', 'skin', 'skirt', 'snake', 'sock', 'spade', 'sponge', 'spoon', 'spring', 'square', 'stamp', 'star', 'station', 'stem', 'stick', 'stocking', 'stomach', 'store', 'street', 'sun', 'table', 'tail', 'thread', 'throat', 'thumb', 'ticket', 'toe', 'tongue', 'tooth', 'town', 'train', 'tray', 'tree', 'trousers', 'umbrella', 'wall', 'watch', 'wheel', 'whip', 'whistle', 'window', 'wing', 'wire', 'worm']

    const rand1 = word1[Math.floor(Math.random() * word1.length)];
    const rand2 = word2[Math.floor(Math.random() * word2.length)];
    return (rand1 + ' ' + rand2)
  }
})