const { Router } = require("express");

const {
  getPrivateChat,
  getPrivatesChats,
  getPrivatesChatsByidGroup,
  createPrivateChat,
  addMessage,
} = require("../controllers/privateChat.controller");
const router = Router();

router.route("/").get(getPrivatesChats).post(createPrivateChat);
router.route("/:id").get(getPrivateChat);
router.route("/groupId").post(getPrivatesChatsByidGroup);

module.exports = router;
