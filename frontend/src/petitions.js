import axios from "axios";
import socket from "./socket";
import { basePath } from "./helpers";
//gets
export const getUserById = async (id) => {
  console.log(id);
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
  const response = await axios.post(`${basePath}messages/lastMessages`, {
    roomsIds: idsRooms,
  });
  console.log(response.data);
  return response.data;
};

export const getRoomsLessTheUserRooms = async (idUser) => {
  const response = await axios.post(`${basePath}rooms/user`, {
    idUser: idUser,
  });
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await axios.post(`${basePath}messages/`, message);
  return response.data;
};

export const createRoom = async (room) => {
  const response = await axios.post(`${basePath}rooms/`, room);
  return response.data;
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
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
  return response.data;
};

export const addMessage = async (props) => {
  const { idRoom, message } = props;
  const response = await axios.put(`${basePath}rooms/${idRoom}`, {
    message: message,
  });
  return response.data;
};

export const getUsersLessOne = async (idUser) => {
  const response = await axios.get(`${basePath}users/allUsers/${idUser}`);
  return response.data;
};

export const getMessagesByChatId = async (idChat) => {
  const response = await axios.get(`${basePath}messages/${idChat}`);
  return response.data;
};

export const getPrivatesChatsByidGroup = async (idGroup) => {
  const response = await axios.post(`${basePath}privateChat/groupId`, {
    idGroup: idGroup,
  });
  return response.data;
};

export const getPrivateChat = async (idChat) => {
  console.log(`${basePath}privateChat/` + idChat);
  const response = await axios.get(`${basePath}privateChat/` + idChat);
  return response.data;
};

//posts

//puts
