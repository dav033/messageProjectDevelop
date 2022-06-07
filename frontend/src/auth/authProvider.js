import { children, createContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import { basePath } from "../helpers";
import { verifyToken, getUserById, loginP } from "../petitions";
import { useQuery, useQueryClient, QueryCache } from "react-query";
import { useMutatePost } from "../hooks/post";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const queryCache = new QueryCache();
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("token");
    const initialValueToken = token ? token : "";
    return initialValueToken;
  });
  const [userIsLoading, setUserIsLoading] = useState(false);
  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log(`Bearer ${token}`);
    const response = await axios.post(
      "/api/users/token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(response.data.user);
  };
  const [election, setElection] = useState("chat");
  const [updatingRoom, setUpdatingRoom] = useState(false);
  const [cambio, setCambio] = useState("");

  const [user, setUser] = useState(async () => {
    setUserIsLoading(true);
    const token = localStorage.getItem("token");
    console.log("a");
    if (token) {
      const tokenResponse = await verifyToken(token);

      const response2 = await axios.get(
        basePath + "users/" + tokenResponse.user.id
      );
      console.log(response2.data);
      // await setUserData(response2.data);
      setUserIsLoading(false);

      return tokenResponse.user;
    } else {
      return null;
    }
  });
  const [receivingMessage, setReceivingMessage] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [receivingUserList, setReceivingUserList] = useState(false);

  useEffect(() => {
    const tokenV = verifyToken(token);
    if (tokenV.message == "Token inválido") {
      localStorage.removeItem("token");
      setToken("");
      logout();
    }

    if (token == "") {
      logout();
    }
  }, []);

  function userInit(args) {
    const { id, userName, token, rooms } = args;

    setUserIsLoading(true);

    let socketId = "";
    socket.connect();
    socket.emit("conectado", id);
    socket.on("socketid", (socketid) => {
      socketId = socketid;
      console.log(socketId);
    });

    setUser({
      id: id,
      userName: userName,
      token: token,
      rooms: rooms,
      socketId: socketId,
    });

    localStorage.setItem("token", token);
    setUserIsLoading(false);
  }

  const loginMutate = useMutatePost("login", loginP);

  const login = async (userCredentials_userName, usersCredentials_password) => {
    loginMutate.mutate(
      {
        userName: userCredentials_userName,
        password: usersCredentials_password,
      },
      {
        onSuccess: (data) => {
          if (data.message === "Usuario autenticado") {
            userInit(data);
          } else if (data.message === "Usuario no encontrado") {
            alert("Este usuario no existe");
          } else if (data.message === "Contraseña incorrecta") {
            alert("Contraseña incorrecta");
          }
        },
      }
    );
  };

  const register = async (props) => {
    const response = await axios.post("/api/users/register", props);
    console.log(response.data);
    const functionArgs = {
      message: response.data.message,
      id: response.data.id,
      userName: response.data.user,
      token: response.data.token,
    };

    if (response.data.message === "Usuario registrado") {
      userInit(functionArgs);
    } else if (response.data.message === "Usuario ya existe") {
      alert("Este usuario ya existe");
    } else if (response.data.message === "Por favor llene todos los campos") {
      alert("Por favor llene todos los campos");
    }
  };

  const logout = () => {
    setUser(null);
    console.log("oaa");
    socket.disconnect();
    socket.emit("desconectado");
    localStorage.removeItem("token");
    // localStorage.removeItem("userData");
    // queryCache.clear();
    // queryClient.removeQueries();
    // console.log("Logout");
  };

  const isLogged = () => !!user;

  var userListAux = [];
  socket.on("usersList", (usersList) => {
    userListAux = usersList;
    setReceivingUserList(true);
    // console.log("fallo");
    setTimeout(() => {
      setReceivingUserList(false);
    }, 1000);
    // console.log("ssdfsdf");
  });

  useEffect(() => {
    if (receivingUserList) {
      setUsersList(userListAux);
    }
  }, [receivingUserList]);

  useEffect(() => {
    if (receivingMessage) {
      console.log("entro");
    }
  }, [receivingMessage]);

  socket.on("message", (message) => {
    console.log("que rico el vicio");
    setReceivingMessage(true);
    setTimeout(() => {
      setReceivingMessage(false);
    }, 1);
  });

  useEffect(() => {
    const awa = async () => {
      if (!userIsLoading && user) {
        const rooms = user.rooms;

        await rooms.map((room) => {
          console.log(room);
          socket.emit("joinRoom", { room: room });
        });
      }
    };
    awa();
  }, [user]);

  const contextValue = {
    user,
    setUser,
    login,
    register,
    logout,
    isLogged,
    getUser,
    updatingRoom,
    setUpdatingRoom,
    usersList,
    election,
    setElection,
    receivingMessage,
    setUpdatingUser,
    userIsLoading,
    cambio,
    setCambio,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
