import io from "socket.io-client";

const port = "http://localhost:4000";
const porProduction = "https://messagesgroup.herokuapp.com";
let socket = io(porProduction, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: "Infinity",
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 10000,
  extraHeaders: {
    "x-auth-token": localStorage.getItem("token"),
    "Access-Control-Allow-Origin": "*",
  },
});

export default socket;
