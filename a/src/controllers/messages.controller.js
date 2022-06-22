const messageCtrl = {};
require("dotenv").config();
const Message = require("../models/message");
const Room = require("../models/room");
const User = require("../models/user");
const privateChat = require("../models/privateChat");

messageCtrl.getMessagesByRoom = async (req, res) => {
  const messages = await Message.find({ room: req.params.id });
  res.json(messages);
};

messageCtrl.sendMessage = async (req, res) => {
  const { temporalMessageData } = req.body;
  const { type, content, transmitter, context, room, receiver } =
    temporalMessageData;

  console.log(context);

  const saveMessage = async () => {
    const newMessage = new Message({
      type: type,
      content: content,
      transmitter: transmitter,
      context: context,
      room: room,
    });

    let aux = "";

    await newMessage.save().then((message) => {
      aux = message._id;
    });

    return aux;
  };

  if (context === "room") {
    const aux = await saveMessage();
    await Room.findByIdAndUpdate(room, {
      $push: { messages: aux },
    });
    res.json(aux);
  } else if (context === "privateChat") {
    const aux = await saveMessage();
    await privateChat.findByIdAndUpdate(room, {
      $push: { messages: aux },
    });
    res.json(aux);
  } else if (context === "provitionalChat") {
    const newChat = new privateChat({
      user1: transmitter,
      user2: receiver,
      messages: [],
    });
    let aux2 = "";
    await newChat.save().then((chat) => {
      console.log(chat);
      aux2 = chat._id;
    });

    const newMessage = new Message({
      type: type,
      content: content,
      transmitter: transmitter,
      context: context,
      room: aux2,
    });
    let aux = "";

    await newMessage.save().then((message) => {
      aux = message._id;
    });

    await privateChat.findByIdAndUpdate(aux2, {
      $push: { messages: aux },
    });

    await User.findByIdAndUpdate(transmitter, {
      $push: { privateChats: aux2 },
    });

    await User.findByIdAndUpdate(receiver, {
      $push: { privateChats: aux2 },
    });

    res.json(aux2);
  }
};

messageCtrl.getLastMessagesAndRoomIdByRoomsIds = async (req, res) => {
  try {
    const { roomsIds } = req.body;
    const messagesAux = [];

    console.log("OOOWO" , roomsIds)

    for (let i = 0; i < roomsIds.length; i++) {
      const messages = await Message.find({ room: roomsIds[i] });
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        messagesAux.push(lastMessage);
      }
    }

    console.log("a", messagesAux.length);

    res.json(messagesAux);
  } catch (error) {
    console.log(error);
  }
};

module.exports = messageCtrl;
