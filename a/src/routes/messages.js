const { Router } = require("express");

const {
  getMessagesByRoom,
  sendMessage,
  getLastMessagesAndRoomIdByRoomsIds,
} = require("../controllers/messages.controller");

const router = Router();

router.route("/").post(sendMessage);
router.route("/:id").get(getMessagesByRoom);
router.route("/lastMessages").post(getLastMessagesAndRoomIdByRoomsIds);

module.exports = router;
