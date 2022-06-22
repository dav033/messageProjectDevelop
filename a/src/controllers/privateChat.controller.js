const privChatCtrl = {};
require("dotenv").config();

const privateChat = require("../models/privateChat");

privChatCtrl.getPrivateChat = async (req, res) => {
  //console.log("HOOK", req.params.id);
  const privateChatAux = await privateChat.findById(req.params.id);
  console.log("HOOL", privateChatAux);
  res.json({ privateChatAux });
};

privChatCtrl.getPrivatesChats = async (req, res) => {
  try {
    const privateChats = await privateChat.find();
    res.json(privateChats);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

privChatCtrl.getPrivatesChatsByidGroup = async (req, res) => {
  try {
    const { idGroup } = req.body;
    const chatsAux = [];
    //console.log(idGroup);

    for (let i = 0; i < idGroup.length; i++) {
      const chat = await privateChat.findById(idGroup[i]);
      chatsAux.push(chat);
    }
    res.json(chatsAux);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

privChatCtrl.createPrivateChat = async (req, res) => {
  const { user1, user2, messages } = req.body;
  try {
    const privateChat = new privateChat({
      user1: user1,
      user2: user2,
      messages: messages,
    });
    await privateChat.save();
    res.json({ message: "Chat creado" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

privChatCtrl.addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    await privateChat.findByIdAndUpdate(req.params.id, {
      $push: { messages: message },
    });
    res.json({ message: "mensaje agregado" });
  } catch (error) {
    console.log("error");
  }
};

module.exports = privChatCtrl;
