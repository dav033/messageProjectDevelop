import "./home.css";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import axios from "axios";

export default function Home() {
  const { election, user, updatingRoom, userData } = useAuth();
  return (
    <div className="Home" style={{}}>
      <button
        onClick={async () => {
          const owo = await axios.get(
            "http://localhost:4000/api/privateChat/62b383ae60559cc6813bbe98"
          );
          console.log(owo);
        }}
      >
        owoo
      </button>

      <div className="Group1">
        <Link to="/login" className="buttonTrans">
          <h4 id="iniciar"></h4>
        </Link>
        <b>O</b>
        <Link to="/messages" className="buttonTrans">
          <h4 id="chatear"></h4>
        </Link>
      </div>
    </div>
  );
}
