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
  getPrivatesChatsByidGroup,
} from "../../../../petitions";
import { useQuery, useQueryClient } from "react-query";
import { transformDate, joinToSocketRoom } from "../../../../helpers";
import { useNavigate } from "react-router-dom";

export default function ChatDashboard(props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    user,
    isLogged,
    userIsLoading,
    setCambio,
    userData,
    receivingMessage,
  } = useAuth();
  const [useAux, setUseAux] = useState([]);
  const [privateChatsAux, setPrivateChatsAux] = useState([]);
  const {
    data: chats,
    error,
    isLoading,
  } = useQuery(
    ["prueba", "getChatBoxes", userData],
    () => getChatsByIdGroup(userData.rooms),
    {
      keepPreviousData: true,
      enabled: userData != undefined,
    }
  );

  const {
    data: lastMessages,
    errorLastMessages,
    isLoadingLastMessages,
  } = useQuery(
    ["prueba", "getLasMessages", userData],
    () => getLastMessagesAndRoomIdByRoomsIds(userData.rooms),
    {
      keepPreviousData: true,
      enabled: userData != undefined && isLogged(),
    }
  );

  const {
    data: privatesChatsLastMessages,
    errorPrivatesChatsLastMessages,
    isLoadingPrivatesChatsLastMessages,
  } = useQuery(
    ["prueba", "getPrivatesChatsLastMessages", userData],
    () => getLastMessagesAndRoomIdByRoomsIds(userData.privateChats),
    {
      keepPreviousData: true,
      enabled: userData != undefined && isLogged(),
    }
  );

  const { data: privateChats, isLoadingPrivateChats } = useQuery(
    ["prueba", "getPrivateChats", userData],
    () => getPrivatesChatsByidGroup(userData.privateChats),
    {
      keepPreviousData: true,
      enabled: userData != undefined && isLogged(),
    }
  );

  useEffect(() => {
    if (
      chats &&
      lastMessages &&
      isLogged() &&
      !userIsLoading &&
      chats != [] &&
      chats != null &&
      chats != undefined
    ) {
      let trueChats = chats;

      trueChats = chats.concat(privateChats);

      // console.log(trueChats);
      let chatsWhitMessages = [];
      trueChats.forEach((chat) => {
        if (chat) {
          if (chat.messages.length != 0) {
            chatsWhitMessages.push(chat);
          }
        }
      });

      let chatsWhitoutMessages = [];
      chats.forEach((chat) => {
        if (chat.messages.length === 0) {
          chatsWhitoutMessages.push({ chat, lastMessage: null });
        }
      });

      let Aux = [];

      //console.log(chatsWhitMessages[0]);

      const absoluteLastMessages = lastMessages.concat(
        privatesChatsLastMessages
      );
      //console.log(absoluteLastMessages);
      chatsWhitMessages.forEach((chat) => {
        absoluteLastMessages.forEach((lastMessage) => {
          if (lastMessage != undefined) {
            if (chat._id === lastMessage.room) {
              //  console.log(chat, "aaaaa", lastMessage);
              Aux.push({
                chat,
                lastMessage,
              });
            }
          }
        });
      });

      //console.log(Aux);

      Aux.sort((a, b) => {
        const dateA = new Date(a.lastMessage.createdAt);
        const dateB = new Date(b.lastMessage.createdAt);
        return dateB - dateA;
      });

      let Aux2 = [];
      Aux.forEach((chat) => {
        Aux2.push(chat);
      });
      // console.log(Aux2);

      Aux2 = Aux2.concat(chatsWhitoutMessages);
      // console.log(Aux2);
      setUseAux(Aux2);
    }
  }, [chats, lastMessages, userData, receivingMessage]);

  const RenderLastMessages = (id) => {
    if (id) {
      const absoluteLastMessages = lastMessages.concat(
        privatesChatsLastMessages
      );
      if (absoluteLastMessages && absoluteLastMessages != undefined) {
        const lastMessage = absoluteLastMessages.find((lastMessage) => {
          if (lastMessage.room == id) {
            return lastMessage;
          }
        });

        if (lastMessage) {
          return lastMessage.content;
        } else {
          return "no hay mensajes";
        }
      }
    }
  };

  const renderDate = (data) => {
    // console.log(data);
    if (data) {
      if (data.lastMessage != null) {
        const messageDate = data.lastMessage.createdAt;
        const dateTransform = transformDate(messageDate);
        const { time, date } = dateTransform;

        return time;
      } else {
        return null;
      }
    } else {
      return "h2";
    }
  };

  useEffect(() => {
    if (privateChats) {
      const prueba = async () => {
        let privateChatsUsersInfo = [];

        for (let i = 0; i < privateChats.length; i++) {
          let otherUser = "";
          if (privateChats[i].user1 == userData._id) {
            otherUser = privateChats[i].user2;
          } else {
            otherUser = privateChats[i].user1;
          }

          const userInfo = await getUserById(otherUser);
          privateChatsUsersInfo.push({
            chatId: privateChats[i]._id,
            userName: userInfo.userName,
          });
        }

        // console.log(
        //   "AAAAAAAAAAAAAAa",
        //   privateChatsUsersInfo,
        //   privateChatsUsersInfo.length
        // );
        setPrivateChatsAux(privateChatsUsersInfo);
      };

      prueba();
    }
  }, [privateChats]);

  function renderChatName(data) {
    if (data) {
      if (data.type) {
        return data.name;
      } else if (privateChatsAux.length != 0) {
        let aux = "";
        privateChatsAux.forEach((chat) => {
          if (chat.chatId == data._id) {
            //console.log(chat);
            aux = chat.userName;
          } else {
            return null;
          }
        });
        return aux;
      }
    }
  }

  const main = () => {
    if (isLogged() && !userIsLoading) {
      if (
        useAux &&
        useAux != undefined &&
        useAux.length != 0 &&
        useAux != null
      ) {
        //console.log(useAux);
        if (
          useAux.length != 0 &&
          useAux != undefined &&
          useAux != null &&
          useAux != [] &&
          useAux[0] != undefined
        ) {
          //console.log("aaaaaaaaa", useAux);
          return useAux.map((chat) => (
            <div
              class="friend-drawer friend-drawer--onhover"
              onClick={() => {
                if (chat.chat.type) {
                  navigate("/room/" + chat.chat._id);
                  setCambio(chat.chat._id);
                } else {
                  navigate("/privateChat/" + chat.chat._id);
                  setCambio(chat.chat._id);
                }
              }}
            >
              <img
                class="profile-image"
                src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
                alt=""
              />
              <div class="text">
                <h6>{renderChatName(chat.chat)}</h6>
                <p class="text-mute d"> {RenderLastMessages(chat.chat._id)}</p>
              </div>
              <span class="time text-muted small">{renderDate(chat)}</span>
            </div>
          ));
        } else {
          return <div>No hay chats</div>;
        }
      } else {
        return <h1>no hay chatsaa</h1>;
      }
    }
  };

  return <div className="chatDashboard">{main()}</div>;
}
