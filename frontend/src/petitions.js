import axios from "axios";
import socket from "./socket";
import { basePath } from "./helpers";

//gets
export const getUserById = async (id) => {
  const response = await axios.get(`${basePath}users/${id}`);
  return response.data.user;
};

export const getChatsByIdGroup = async (idGroup) => {
  const response = await axios.post(`${basePath}rooms/groupId/`, {
    idGroup: idGroup,
  });
  return response.data;
};

export const getRooms = async () => {
  const response = await axios.get(`${basePath}rooms/`);
  return response.data;
};

export const verifyToken = async (token) => {
  const response = await axios.post(
    `${basePath}users/token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getMessagesByRoomId = async (idRoom) => {
  const response = await axios.get(`${basePath}messages/${idRoom}`);
  return response.data;
};

export const getLastMessagesAndRoomIdByRoomsIds = async (idsRooms) => {
  console.log("actual", idsRooms);
  const response = await axios.post(`${basePath}messages/lastMessages`, {
    roomsIds: idsRooms,
  });
  return response.data;
};

export const getRoomsLessTheUserRooms = async (idUser) => {
  const response = await axios.post(`${basePath}rooms/user`, {
    idUser: idUser,
  });
  return response.data;
};

export const sendMessage = async (message) => {
  console.log(message);
  const response = await axios.post(`${basePath}messages/`, message);
  return response.data;
};

export const createRoom = async (room) => {
  console.log(room);
  const response = await axios.post(`${basePath}rooms/`, room);
  return response.data;
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  console.log(`Bearer ${token}`);
  const response = await axios.post(
    "${basePath}users/token",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
};

export const loginP = async (user) => {
  const response = await axios.post(`${basePath}users/login`, user);
  return response.data;
};

export const subscribeToRoom = async (props) => {
  const { idRoom, idUser } = props;
  const response = await axios.post(`${basePath}users/${idUser}/subscribe`, {
    roomId: idRoom,
  });
  console.log(response.data);
  return response.data;
};

//posts

//puts
