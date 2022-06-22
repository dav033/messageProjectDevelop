import { children, createContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import { basePath } from "../helpers";
import { verifyToken, getUserById, loginP } from "../petitions";
import { useQuery, useQueryClient, QueryCache } from "react-query";
import { useMutatePost } from "../hooks/post";
import { useTimeout } from "usehooks-ts";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const queryCache = new QueryCache();
  const queryClient = useQueryClient();
  const [chatAux, setChatAux] = useState();
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("token");
    const initialValueToken = token ? token : "";
    return initialValueToken;
  });

  const [userIsLoading, setUserIsLoading] = useState(false);
  const getUser = async () => {
    const token = localStorage.getItem("token");
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

  const [userIsDoingSomething, setUserIsDoingSomething] = useState(false);

  const [election, setElection] = useState("chat");
  const [updatingRoom, setUpdatingRoom] = useState(false);
  const [cambio, setCambio] = useState("");
  const [socketId, setSocketId] = useState("");
  const userDoing = () => {
    setUserIsDoingSomething(true);
    setTimeout(setUserIsDoingSomething(false), 500);
  };

  useEffect(() => {
    const verifyTokenFunction = async () => {
      const token = localStorage.getItem("token");
      const response = await verifyToken(token);
      if (response.message === "Token invalido") {
        localStorage.removeItem("token");
        setToken("");
      } else {
        setUser(response.user);
      }
    };

    if (userIsDoingSomething) {
      verifyTokenFunction();
    }
  }, [userIsDoingSomething]);

  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("user");
    const initialValueUser = user ? JSON.parse(user) : "";
    return initialValueUser;
  });

  const { data: userData, isFetching: isLoadingUserData } = useQuery(
    ["prueba", "getUser", user],
    async () => await getUserById(user.id),
    {}
  );

  const [receivingMessage, setReceivingMessage] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [receivingUserList, setReceivingUserList] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

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

    const userObj = {
      id,
      userName,
      token,
      socketId,
      rooms,
      socketId,
    };

    setUser(userObj);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
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
    const response = await axios.post(`${basePath}users/register`, props);
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
    setUsersList(usersList);
  });

  socket.on("message", (message) => {
    setReceivingMessage(true);
    setTimeout(() => {
      setReceivingMessage(false);
    }, 1);
  });

  socket.on("identifier", (socketid) => {
    setSocketId(socketid);
  });

  useEffect(() => {
    const awa = async () => {
      if (!userIsLoading && user) {
        const rooms = user.rooms;

        await rooms.map((room) => {
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
    userData,
    creatingRoom,
    setCreatingRoom,
    isLoadingUserData,
    userDoing,
    chatAux,
    socketId,
    setChatAux,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
