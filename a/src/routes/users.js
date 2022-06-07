const { Router } = require("express");

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  autenticateUser,
  verifyToken,
  registerUser,
  subscribeToRoom,
} = require("../controllers/users.controllers");
const router = Router();

router.route("/").get(getUsers).post(createUser);
router.route("/login").post(autenticateUser);
router.route("/token").post(verifyToken);
router.route("/:id").get(getUser).put(updateUser);
router.route("/register").post(registerUser);
router.route("/:id/subscribe").post(subscribeToRoom);

module.exports = router;
