import useAuth from "../../auth/useAuth";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMutatePost } from "../../hooks/post";
import { createRoom } from "../../petitions";
import socket from "../../socket";
import { basePath } from "../../helpers";
export default function Test() {
  const {
    login,
    setUpdatingUser,
    logout,
    user,
    setUser,
    setUpdatingRoom,
    userData,
  } = useAuth();

  const QueryClient = useQueryClient();

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

    console.log(response.data.user);
    setUser(response.data.user);
  }

  function name() {
    console.log(user);
  }
  const createRoomMutate = useMutatePost("getRooms", createRoom);

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
        onSuccess: () => {
          nombreRoom.value = "";
          typeRoom.value = "";
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
