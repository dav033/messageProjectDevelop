const { Router } = require("express");

const {
  getRoom,
  createRoom,
  getRooms,
  updateRoom,
  removeAUser,
  addUser,
  addMessage,
  getRoomsByIdGroup,
  getRoomsLessTheUserRooms,
} = require("../controllers/room.controllers");
const router = Router();

router.route("/").get(getRooms).post(createRoom);
router.route("/:id").get(getRoom).put(addMessage);
router.route("/:id/users").put(removeAUser).post(addUser);
router.route("/groupId").post(getRoomsByIdGroup);
router.route("/user").post(getRoomsLessTheUserRooms);

module.exports = router;
