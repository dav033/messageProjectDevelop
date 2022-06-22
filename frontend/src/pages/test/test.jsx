import useAuth from "../../auth/useAuth";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMutatePost } from "../../hooks/post";
import { createRoom, subscribeToRoom } from "../../petitions";
import socket from "../../socket";
import { basePath, joinToSocketRoom } from "../../helpers";
export default function Test() {
  const {
    login,
    setUpdatingUser,
    logout,
    user,
    setUser,
    setUpdatingRoom,
    userData,
    setCreatingRoom,
    usersList,
    socketId,
  } = useAuth();

  const queryClient = useQueryClient();

  async function owo() {
    const token = localStorage.getItem("token");
    console.log(`Bearer ${token}`);
    const response = await axios.post(
      `${basePath}users/token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
  }

  async function prueba() {
    const resonse = await axios.get(
      "http://localhost:4000/api/privateChat/62b383ae60559cc6813bbe98",
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Negotiation: "Accept",
          "X-Powered-By": "express",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          Negotiate: "Accept",
          //  Connection: "Keep-Alive",
        },
      }
    );
    console.log(resonse.data);
  }

  function name() {
    console.log(user);
  }
  const createRoomMutate = useMutatePost("prueba", createRoom);

  const sendRoom = async (e) => {
    e.preventDefault();
    const { nombreRoom, typeRoom } = e.target.elements;

    const roomData = {
      name: nombreRoom.value,
      creator: user.id,
      type: typeRoom.value,
      users: [user.id],
    };

    createRoomMutate.mutate(
      { roomData },
      {
        onSuccess: (response) => {
          nombreRoom.value = "";
          typeRoom.value = "Publica";
          console.log(response);
          // subscribeToRoom({ idRoom: response, idUser: user.id });
          //queryClient.invalidateQueries("getUser");
          //queryClient.invalidateQueries("getChatBoxes");
          queryClient.invalidateQueries("prueba");
          joinToSocketRoom(response);
        },
      }
    );
  };

  return (
    <div className="home" style={{ flex: 4, backgroundColor: "" }}>
      <button onClick={(e) => prueba()}>owowow</button>
      <button onClick={(e) => owo()}>token</button>
      <button onClick={(e) => name()}>suario</button>
      <form onSubmit={(e) => sendRoom(e)}>
        <input type="text" placeholder="nombre" id="nombreRoom" input />
        <select id="typeRoom">
          <option value="Publica">Publica</option>
          <option value="Privada">Privada</option>
        </select>
        <button type="submit">crear sala</button>
      </form>
    </div>
  );
}
