const port = process.env.PORT || 4000;

export const basePath = "https://messagesgroup.herokuapp.com/api/";
//export const basePath = `http://localhost:${port}/api/`;

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
