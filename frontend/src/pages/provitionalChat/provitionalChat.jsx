import BaseRoom from "../../components/baseRoom/baseRoom";
import useAuth from "../../auth/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ProvitionalChat() {
  const { chatAux, setChatAux, cambio } = useAuth();

  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    console.log(chatAux);
  }, []);

  return <BaseRoom receiver={chatAux} context="provitionalChat" />;
}
