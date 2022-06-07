import "./home.css";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";

export default function Home() {
  const { election, user, updatingRoom, userData } = useAuth();
  return (
    <div className="Home" style={{}}>
      <button onClick={(e) => console.log(userData)}>owoo</button>

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
