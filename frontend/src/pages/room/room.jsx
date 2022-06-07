import "./room.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../../socket";
import useAuth from "../../auth/useAuth";
import {
  getChatsByIdGroup,
  getMessagesByRoomId,
  sendMessage,
} from "../../petitions";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useMutatePost } from "../../hooks/post";
import Message from "../../components/message/message";
import { transformDate } from "../../helpers";

export default function Room() {
  const [roomId, setRoomId] = useState("");
  const { user, isLogged, receivingMessage, cambio, userIsLoading } = useAuth();
  const queryClient = useQueryClient();
  const [temporalMessage, setTemporalMessage] = useState("");
  const [temporalMessageData, setTemporalMessageData] = useState({});

  useEffect(() => {
    setRoomId(window.location.pathname.split("/")[2]);
  }, [cambio]);

  useEffect(() => {
    if (receivingMessage) {
      queryClient.invalidateQueries("prueba");
    }
  }, [receivingMessage]);

  const { data: messages, isLoadingMessages } = useQuery(
    ["prueba", "getMessages", roomId],
    async () => await getMessagesByRoomId(roomId)
  );

  const sendMessageMutate = useMutatePost("prueba", sendMessage);

  const handleSendMessage = async () => {
    console.log(temporalMessageData);
    sendMessageMutate.mutate(
      { temporalMessageData },
      {
        onSuccess: () => {
          socket.emit("sendMessage", temporalMessageData);
          setTemporalMessage("");
          setTemporalMessageData({});
          document.getElementById("message").value = "";
          queryClient.invalidateQueries("prueba");
        },
      }
    );
  };

  useEffect(() => {
    setTemporalMessageData({
      type: "text",
      content: temporalMessage,
      transmitter: user.id,
      context: "room",
      room: roomId,
    });
  }, [temporalMessage]);

  useEffect(() => {
    let element = document.getElementById("ewe");
    element.scrollTop = element.scrollHeight;
  }, [messages]);

  const renderMessages = () => {
    if (
      !userIsLoading &&
      !isLoadingMessages &&
      messages != null &&
      messages.length != 0 &&
      messages != undefined
    ) {
      let dateAux = "aa";
      return messages.map((message) => {
        const dateTransform = transformDate(message.createdAt);

        const { date, time } = dateTransform;

        const dateAdviser = (date, dateAux) => {
          const dateLessYear = date.split(" ")[0] + " " + date.split(" ")[1];

          if (date !== dateAux) {
            return (
              <h1 className="date">
                <b
                  style={{
                    backgroundColor: "#393E46",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "20px",
                    opacity: "",
                  }}
                >
                  {dateLessYear}
                </b>
              </h1>
            );
          } else {
            return null;
          }
        };

        const toRender = (data) => {
          const { type, date, dateAux2 } = data;
          return (
            <>
              {dateAdviser(date, dateAux2)}
              <Message content={message.content} type={type} time={time} />
            </>
          );
        };

        if (message.transmitter === user.id) {
          const dateAux2 = dateAux;
          dateAux = date;
          return toRender({ type: "transmitter", date, dateAux2 });
        } else {
          const dateAux2 = dateAux;
          dateAux = date;
          return toRender({ type: "receiver", date, dateAux2 });
        }
      });
    }
  };

  return (
    <div class="seccion-chat" style={{ height: "100%" }}>
      <div class="usuario-seleccionado">
        <div class="avatar">
          <img src="ruta_img" alt="img" />
        </div>
        <div class="cuerpo">
          <span>Nombre de usuario</span>
          <span>Activo - Escribiendo...</span>
        </div>
        <div class="opciones">
          <ul>
            <li>
              <button type="button">
                <i class="fas fa-video"></i>
              </button>
            </li>
            <li>
              <button type="button">
                <i class="fas fa-phone-alt"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="panel-chat"
        style={{ backgroundColor: "", overflowX: "hidden" }}
        id="ewe"
      >
        {renderMessages()}
      </div>
      <div class="panel-escritura" style={{}}>
        <form class="textarea">
          <div class="opcines">
            <button type="button">
              <i class="fas fa-file"></i>
              <label for="file"></label>
              <input type="file" id="file" />
            </button>
            <button type="button">
              <i class="far fa-image"></i>
              <label for="img"></label>
              <input type="file" id="img" />
            </button>
          </div>
          <textarea
            name="message"
            id="message"
            placeholder="Escribe un mensaje aqui"
            onChange={(e) => setTemporalMessage(e.target.value)}
          ></textarea>
          <button
            type="button"
            class="enviar"
            onClick={() => {
              handleSendMessage();
            }}
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
