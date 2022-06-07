const messageCtrl = {};
require("dotenv").config();
const Message = require("../models/message");
const Room = require("../models/room");

messageCtrl.getMessagesByRoom = async (req, res) => {
  const messages = await Message.find({ room: req.params.id });
  res.json(messages);
};

messageCtrl.sendMessage = async (req, res) => {
  const { temporalMessageData } = req.body;
  const { type, content, transmitter, context, room } = temporalMessageData;

  const newMessage = new Message({
    type: type,
    content: content,
    transmitter: transmitter,
    context: context,
    room: room,
  });
  await newMessage.save(function (err, room) {
    Room.findByIdAndUpdate(room, {
      $push: { messages: room._id },
    });
    res.json(room);
  });
};

messageCtrl.getLastMessagesAndRoomIdByRoomsIds = async (req, res) => {
  try {
    const { roomsIds } = req.body;
    const messagesAux = [];
    for (let i = 0; i < roomsIds.length; i++) {
      const messages = await Message.find({ room: roomsIds[i] });
      const lastMessage = messages[messages.length - 1];

      messagesAux.push({
        roomId: roomsIds[i],
        message: lastMessage,
      });
    }
    res.json(messagesAux);
  } catch (error) {
    console.log(error);
  }
};

module.exports = messageCtrl;
