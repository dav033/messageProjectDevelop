import "./navBar.css";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faC,
  faCoffee,
  faHome,
  faArrowRightFromBracket,
  faUser,
  faUserLargeSlash,
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { user, logout, isLogged } = useAuth();
  function renderLoggedOptions() {
    if (isLogged()) {
      return (
        <div className="loggedOptions" style={{ float: "right" }}>
          <button
            to="/messages"
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "21px",
              marginRight: "10px",
              color: "white",
            }}
          >
            <FontAwesomeIcon icon={faBell} />
          </button>

          <Link to="/test">
            {" "}
            <FontAwesomeIcon icon={faUser} /> Perfil
          </Link>

          <Link to="/" onClick={(e) => logout(e)}>
            <i className="icon-signOut"></i> Cerrar Sesión
          </Link>
        </div>
      );
    }
  }
  return (
    <div className="Navbar">
      <Link to="/" className="titulo">
        <b>Group messages</b>
      </Link>

      {renderLoggedOptions()}
    </div>
  );
}
