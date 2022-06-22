import { useEffect, useState } from "react";
import useAuth from "../../auth/useAuth";
import { useQuery, useQueryClient, useMutation } from "react-query";
import BaseRoom from "../../components/baseRoom/baseRoom";
import { getMessagesByChatId, getPrivateChat } from "../../petitions";
import { getOtherUser } from "../../helpers";
import axios from "axios";
export default function PrivateChat() {
  const [chatId, setChatId] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const { user, isLogged, receivingMessage, cambio, userIsLoading } = useAuth();
  useEffect(() => {
    const chat_id = window.location.pathname.split("/")[2];
    console.log(chat_id);
    setChatId(chat_id);

    const getOtherUserID = async () => {
      const response = await getPrivateChat(chat_id);
      console.log(response);
      //const otherUserResponse = getOtherUser(user.id, response);
      const otherUserResponse = await axios.get(
        `http://localhost:4000/api/privateChat/${chat_id}`
      );
      console.log("otroUsuario:", otherUserResponse, "usuarioActual", user.id);
      setOtherUser(otherUserResponse);
    };

    getOtherUserID();
  }, [cambio, user]);

  const { data: messages } = useQuery(
    ["prueba", "getMessages", chatId],
    async () => await getMessagesByChatId(chatId)
  );
  return (
    <BaseRoom
      context="privateChat"
      messages={messages}
      roomId={chatId}
      receiver={otherUser}
    />
  );
}
