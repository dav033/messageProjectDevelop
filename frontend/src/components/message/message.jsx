import "./message.scss";
import useAuth from "../../auth/useAuth";
import { useState, useEffect } from "react";

export default function Message(props) {
  const { user, isLogged, receivingMessage, cambio, userIsLoading } = useAuth();
  const { content, image, time, type } = props;
  const [typeMessage, setTypeMessage] = useState();

  useEffect(() => {
    if (type === "transmitter") {
      setTypeMessage("mensaje left");
    } else {
      setTypeMessage("mensaje");
    }
  }, []);

  return (
    <div className={typeMessage}>
      <div className="avatar">
        <img src="ruta_img" alt="mg" />
      </div>
      <div className="cuerpo">
        <div className="texto">{content}</div>
        <span className="tiempo" style={{ backgroundColor: "" }}>
          <i className="far fa-clock"></i>
          {time}
        </span>
        <ul className="opciones-msj">
          <li>
            <button type="button">
              <i class="fas fa-times"></i>
            </button>
          </li>
          <li>
            <button type="button">
              <i class="fas fa-share-square"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
