const roomCtrl = {};
require("dotenv").config();

const Room = require("../models/room");
const AWS = require("aws-sdk");
const User = require("../models/user");
const room = require("../models/room");

const spacesEndpoint = new AWS.Endpoint("sfo3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
});

roomCtrl.getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

roomCtrl.getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  res.json({ room });
};

roomCtrl.createRoom = async (req, res) => {
  const { roomData } = req.body;
  const { name, image, creator, users, type } = roomData;
  const newRoom = new Room({
    name: name,
    image: image,
    creator: creator,
    users: users,
    type: type,
  });
  await newRoom.save(function (err, room) {
    User.findByIdAndUpdate(creator, {
      $push: { rooms: room._id },
    });

    res.json(room.id);
  });
};

roomCtrl.updateRoom = async (req, res) => {
  try {
    const { name, image, creator, users, type } = req.body;
    await Room.findByIdAndUpdate(req.params.id, {
      name: name,
      image: image,
      creator: creator,
      users: users,
      type: type,
    });
    res.json({ message: "usuarios actualizados" });
  } catch (error) {
    console.log("error");
  }
};

roomCtrl.removeAUser = async (req, res) => {
  try {
    const { user } = req.body;
    await Room.findByIdAndUpdate(req.params.id, {
      $pull: { users: user },
    });
    res.json({ message: "usuario eliminado" });
  } catch (error) {
    console.log("error");
  }
};

roomCtrl.addUser = async (req, res) => {
  try {
    const { user } = req.body;
    await Room.findByIdAndUpdate(req.params.id, {
      $push: { users: user },
    });
    res.json({ message: "usuario agregado" });
  } catch (error) {
    console.log("error");
  }
};

roomCtrl.addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    await Room.findByIdAndUpdate(req.params.id, {
      $push: { messages: message },
    });
    res.json({ message: "mensaje agregado" });
  } catch (error) {
    console.log("error");
  }
};

roomCtrl.getRoomsByIdGroup = async (req, res) => {
  try {
    const { idGroup } = req.body;
    const roomAux = [];
    //console.log(idGroup);

    for (let i = 0; i < idGroup.length; i++) {
      const room = await Room.findById(idGroup[i]);
      roomAux.push(room);
    }
    res.json(roomAux);
  } catch (error) {
    console.log("error");
  }
};

roomCtrl.getRoomsLessTheUserRooms = async (req, res) => {
  try {
    const { idUser } = req.body;
    const roomAux = [];
    const user = await User.findById(idUser);
    const rooms = await Room.find();

    for (let i = 0; i < rooms.length; i++) {
      if (user.rooms.indexOf(rooms[i]._id) === -1) {
        roomAux.push(rooms[i]);
      }
    }

    res.json(roomAux);
  } catch (error) {
    console.log("error");
  }
};

module.exports = roomCtrl;
