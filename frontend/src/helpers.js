import socket from "./socket";

const port = process.env.PORT || 4000;

//export const basePath = "https://messagesgroup.herokuapp.com/api/";
export const basePath = `http://localhost:4000/api/`;

export const transformDate = (date) => {
  const timeDatabase = new Date(date);
  const actualTime = new Date(timeDatabase.getTime());
  const timeString = actualTime.toString();
  const timeMessage = timeString.split(" ");
  const timeAux = timeMessage[4].split(":");
  const timeMessageLessSeconds = timeAux[0] + ":" + timeAux[1];
  const dateReturn =
    timeMessage[1] + " " + timeMessage[2] + " " + timeMessage[3];
  const returnObject = {
    date: dateReturn,
    time: timeMessageLessSeconds,
  };
  return returnObject;
};

export const joinToSocketRoom = (room) => {
  socket.emit(`joinRoom`, { room: room });
};

export const getSocketIdByUserId = (userID, usersList) => {
  let aux = "";
  usersList.forEach((user) => {
    console.log(userID, user.user_id);
    if (user.user_id === userID) {
      aux = user.socket_id;
    }
  });

  return aux;
};

export const getOtherUser = (userID, object) => {
  const { user1, user2 } = object;
  console.log(object);
  let aux = "";
  if (userID === user1) {
    aux = user2;
  } else if (userID === user2) {
    aux = user1;
  }

  return aux;
};
