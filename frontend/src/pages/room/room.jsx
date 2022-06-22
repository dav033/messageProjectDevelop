import "./room.scss";
import { useState, useEffect } from "react";
import socket from "../../socket";
import useAuth from "../../auth/useAuth";
import {
  addMessage,
  getChatsByIdGroup,
  getMessagesByRoomId,
  sendMessage,
} from "../../petitions";
import { useQuery, useQueryClient, useMutation } from "react-query";
import BaseRoom from "../../components/baseRoom/baseRoom";

export default function Room() {
  const [roomId, setRoomId] = useState("");
  const { user, isLogged, receivingMessage, cambio, userIsLoading } = useAuth();

  useEffect(() => {
    setRoomId(window.location.pathname.split("/")[2]);
  }, [cambio]);

  const { data: messages, isLoadingMessages } = useQuery(
    ["prueba", "getMessages", roomId],
    async () => await getMessagesByRoomId(roomId)
  );

  return <BaseRoom messages={messages} roomId={roomId} context="room" />;
}
