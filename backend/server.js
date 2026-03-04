const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("joinHotel", (hotelId) => {
    socket.join(`hotel_${hotelId}`);
  });

  socket.on("newOrder", (order) => {
    io.to(`hotel_${order.hotelId}`).emit("orderNotification", order);
  });

  socket.on("statusUpdate", (data) => {
    io.to(`user_${data.userId}`).emit("orderStatusChanged", data);
  });

  socket.on("joinUser", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Socket server running on port 5000");
});