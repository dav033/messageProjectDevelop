const { Server } = require("socket.io");
const socketiojwt = require("socketio-jwt");
require("dotenv").config();
const app = require("express");
const socketServer = require("http").Server(app);
var usersList = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    const count = io.engine.clientsCount;
    console.log(count);
    console.log(usersList);
    socket.on("conectado", (id) => {
      console.log("usuario conectado", socket.id);
      io.to(socket.id).emit("identifier", socket.id);
      usersList.push({ user_id: id, socket_id: socket.id });
      console.log("userList", usersList);
      io.emit("usersList", usersList);
    });

    socket.on("disconnect", (...args) => {
      console.log("usuario desconectado", socket.id);
      usersList = usersList.filter((user) => user.socket_id !== socket.id);
      console.log("usersList", usersList);
      io.emit("usersList", usersList);
    });

    socket.on("joinRoom", (args) => {
      const { room, userName, userId } = args;
      socket.join(room);
      console.log("usuario conectado a la sala", room);
    });

    socket.on("sendMessageToRoom", (args) => {
      const { type, content, transmitter, context, room } = args;
      console.log("mensaje recibido", args);
      socket.to(room).emit("message", { content, transmitter, context, room });
    });

    socket.on("sendMessageToPrivateChat", (args) => {
      const { sender, message } = args;
      const { receiver, content, transmitter, context, room } = message;
      console.log("mensaje recibido", args);
      socket.to(receiver).emit("message", { content, transmitter, context });
    });
  });

  // socketServer.listen(5000, () => {
  //   console.log("Socket escuchando en el puerto 5000");
  // });

  Server.listen;
};
