import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import axios from "axios";
import useAuth from "../../auth/useAuth";
import { useEffect } from "react";

export default function Login() {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/messages");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    const { user, password } = e.target.elements;
    const userData = {
      userName: user.value,
      password: password.value,
    };
    console.log(userData);

    login(user.value, password.value);
  }

  return (
    <div className="home">
      <form className="login" onSubmit={(e) => handleSubmit(e)}>
        <div
          className="inputContainer"
          id="userContainer"
          style={{ backgroundColor: "" }}
        >
          <input
            type="text"
            placeholder=" "
            className="loginInput"
            id="user"
            autoComplete="off"
          />
          <label
            for="userInput"
            className="loginLabel"
            style={{ backgroundColor: "" }}
          >
            Usuario
          </label>
        </div>

        <div
          className="inputContainer"
          id="passwordContainer"
          style={{ backgroundColor: "" }}
        >
          <input
            type="password"
            placeholder=" "
            className="loginInput"
            id="password"
            autoComplete="off"
          />
          <label for="userInput" className="loginLabel ">
            Contraseña
          </label>
        </div>

        <div className="buttonContainer">
          <button type="submit" className="submitInput">
            Ingresar
          </button>
          <div className="toRegister" style={{ backgroundColor: "" }}>
            <h5>¿No tienes cuenta?</h5>
            &nbsp;
            <Link to="/register">Haz click aqui</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
