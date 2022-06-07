const usersCtrl = {};
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { _, pick } = require("underscore");

const User = require("../models/user");
const Room = require("../models/room");
const AWS = require("aws-sdk");

const spacesEndpoint = new AWS.Endpoint("sfo3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
});

usersCtrl.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

usersCtrl.createUser = async (req, res) => {
  const { userName, password, email } = req.body;
  const newUser = new User({
    userName: userName,
    email: email,
    password: password,
  });
  await newUser.save(function (err, room) {
    res.json(room.id);
  });
};

usersCtrl.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ user });
};

usersCtrl.updateUser = async (req, res) => {
  try {
    const { userName, password, email, rooms } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      userName: userName,
      email: email,
      password: password,
      rooms: rooms,
    });
    res.json({ message: "usuario actuzlizado" });
  } catch (error) {
    console.log("error");
  }
};

usersCtrl.registerUser = async (req, res) => {
  const { userName, password, confirmPassword, email } = req.body;
  const users = await User.find();
  const user = users.find((user) => user.userName === userName);

  if (password !== confirmPassword) {
    return res.json({ message: "Las contraseñas no coinciden" });
  } else if (user) {
    return res.json({ message: "El usuario ya existe" });
  } else if (
    userName === "" ||
    password === "" ||
    email === "" ||
    confirmPassword === ""
  ) {
    return res.json({ message: "Por favor llene todos los campos" });
  } else {
    const newUser = new User({
      userName: userName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    await newUser.save(function (err, room) {
      const userForToken = {
        id: room.id,
        userName: room.userName,
        email: room.email,
      };
      const token = jwt.sign(userForToken, process.env.SECRET_WORD, {
        expiresIn: "5h",
      });

      return res.json({
        message: "Usuario registrado",
        id: room.id,
        user: room.userName,
        token: token,
      });
    });
  }
};

usersCtrl.autenticateUser = async (req, res) => {
  const { userName, password } = req.body;
  const userDB = await User.findOne({ userName });

  if (!userDB) {
    return res.json({
      message: "Usuario no encontrado",
    });
  } else {
    const passwordDB = userDB.password;
    if (passwordDB === password) {
      const userForToken = {
        id: userDB.id,
        userName: userDB.userName,
        email: userDB.email,
        rooms: userDB.rooms,
      };

      const token = jwt.sign(userForToken, process.env.SECRET_WORD, {
        expiresIn: "5h",
      });

      return res.json({
        message: "Usuario autenticado",
        user: userDB.userName,
        id: userDB._id,
        token: token,
        rooms: userDB.rooms,
      });
    } else {
      return res.json({
        message: "Contraseña incorrecta",
      });
    }
  }
};

usersCtrl.verifyToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const userJwt = jwt.verify(token, process.env.SECRET_WORD);

    return res.json({
      message: "Token valido",
      user: {
        id: userJwt.id,
        userName: userJwt.userName,
        email: userJwt.email,
        token: token,
        rooms: userJwt.rooms,
      },
    });
  } catch (error) {
    return res.json({
      message: "Token invalido",
    });
  }
};

usersCtrl.subscribeToRoom = async (req, res) => {
  const { roomId } = req.body;
  const userId = req.params.id;
  //console.log(userId, roomId);
  const user = await User.findById(userId);
  const room = user.rooms.find((room) => room.id === roomId);

  if (room) {
    return res.json({
      message: "Ya estas suscrito a esta sala",
    });
  } else {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          rooms: roomId,
        },
      });

      await Room.findByIdAndUpdate(roomId, {
        $push: {
          users: userId,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.json({
        success: false,
      });
    }
  }
};

module.exports = usersCtrl;
