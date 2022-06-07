import "./chatsDashboard.scss";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import useAuth from "../../../../auth/useAuth";
import {
  getUserById,
  getChatsByIdGroup,
  getRooms,
  getMessagesByRoomId,
  getLastMessagesAndRoomIdByRoomsIds,
} from "../../../../petitions";
import { useQuery, useQueryClient } from "react-query";

import { useNavigate } from "react-router-dom";

export default function ChatDashboard(props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLogged, userIsLoading, setCambio } = useAuth();
  const refresh = useRef(false);
  const {
    data: chats,
    error,
    isLoading,
  } = useQuery(["getChatBoxes", user.rooms], () =>
    getChatsByIdGroup(user.rooms)
  );

  window.onbeforeunload = function () {
    refresh.current = true;
    console.log(refresh.current);
  };

  const {
    data: lastMessages,
    errorLastMessages,
    isLoadingLastMessages,
  } = useQuery(
    ["prueba", "getLasMessages", user.rooms],
    () => getLastMessagesAndRoomIdByRoomsIds(user.rooms),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const RenderLastMessages = (id) => {
    if (lastMessages && !userIsLoading) {
      const lastMessage = lastMessages.find((message) => message.roomId === id);

      if (lastMessage && lastMessage.message) {
        return lastMessage.message.content;
      } else {
        return "no hay mensajes";
      }
    }
  };

  const main = () => {
    if (
      chats != undefined &&
      (chats != null) != 0 &&
      !isLoadingMessages &&
      !userIsLoading &&
      isLogged() &&
      !refresh.current
    ) {
      return chats.map((chat) => (
        <div
          class="friend-drawer friend-drawer--onhover"
          onClick={(e) => {
            navigate("/room/" + chat._id);
            setCambio(chat._id);
          }}
        >
          <img
            class="profile-image"
            src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
            alt=""
          />
          <div class="text">
            <h6>{chat.name}</h6>
            <p class="text-muted">{RenderLastMessages(chat._id)}</p>
          </div>
          <span class="time text-muted small">13:21</span>
        </div>
      ));
    } else {
      return <h1>Loading...</h1>;
    }
  };

  return <div className="chatDashboard">{main()}</div>;
}
