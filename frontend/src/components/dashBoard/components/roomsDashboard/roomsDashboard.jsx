import "./roomsDashboard.scss";
import {
  faBell,
  faC,
  faCoffee,
  faHome,
  faArrowRightFromBracket,
  faUser,
  faUserLargeSlash,
  faXmark,
  faMagnifyingGlass,
  faUnlock,
  faLock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import sockets from "../../../../socket";
import useAuth from "../../../../auth/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRoomsLessTheUserRooms,
  subscribeToRoom,
} from "../../../../petitions";
import { useQuery, useQueryClient } from "react-query";
import { useMutatePost } from "../../../../hooks/post";
import ListComponent from "../../../listComponent/listComponent";

export default function RoomsDashboard(props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, updatingRoom, setCambio } = useAuth();

  const {
    data: rooms,
    error,
    isLoading,
  } = useQuery(["getRooms"], () => getRoomsLessTheUserRooms(user.id));

  const renderIconPerType = (type) => {
    if (type === "Publica") {
      return <FontAwesomeIcon icon={faUnlock} style={{ color: "white" }} />;
    } else {
      return <FontAwesomeIcon icon={faLock} style={{ color: "white" }} />;
    }
  };

  async function joinRoom(idRoom, usersRoom) {
    console.log("aaa");
    let aux = false;

    const args = {
      room: idRoom,
      userName: user.userName,
      userId: user.id,
    };

    const idUser = user.id;
    const response = await subscribeToRoom({ idRoom, idUser });
    console.log(response.success);
    if (response.success) {
      sockets.emit("joinRoom", { room: idRoom });
      navigate(`/room/${idRoom}`);
      setCambio(idRoom);
      queryClient.invalidateQueries("prueba");
      queryClient.invalidateQueries("getRooms");
    } else {
      alert("No puedes entrar a esta sala");
    }
  }

  function main() {
    if (rooms) {
      if (rooms.length != 0) {
        const roomInformation = (room) => {
          return (
            <>
              <div id="usersInGroup" className="flexItem">
                <FontAwesomeIcon icon={faUser} />
                &nbsp;
                {room.users.length}
              </div>
              <div className="flexItem">{renderIconPerType(room.type)}</div>
            </>
          );
        };
        return rooms.map((room) => (
          <ListComponent
            onClickFunction={() => joinRoom(room._id, room.users)}
            text={room.name}
            optionalContent={roomInformation(room)}
          />
        ));
      } else {
        return <div>No hay salas</div>;
      }
    } else {
      return <h1>no hay salas ñero</h1>;
    }
  }

  return <>{main()}</>;
}
