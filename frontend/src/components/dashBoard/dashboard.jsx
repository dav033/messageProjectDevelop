import useAuth from "../../auth/useAuth";
import "./dashboard.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import RoomsDashboard from "./components/roomsDashboard/roomsDashboard";
import UsersDashboard from "./components/usersDashboard/usersDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sockets from "../../socket";

import {
  faBell,
  faC,
  faCoffee,
  faHome,
  faArrowRightFromBracket,
  faUser,
  faUserLargeSlash,
  faXmark,
  faMagnifyingGlass,
  faUnlock,
  faLock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState } from "react";
import ChatDashboard from "./components/chatsDashboard/chatsDashboard";

export default function Dashboard() {
  // useEffect(() => {
  //   document.getElementById("chat").classList.add("active");
  //   console.log("funcionando")
  // }, []);

  const {
    logout,
    isLogged,
    updatingRoom,
    user,
    election,
    setElection,
    userIsLoading,
    userData,
  } = useAuth();
  const [rooms, setRooms] = useState([]);

  const searchBox = document.querySelector(".search-box");
  const searchBtn = document.querySelector(".search-icon");
  const cancelBtn = document.querySelector(".cancel-icon");
  const searchInput = document.querySelector("input");
  const searchData = document.querySelector(".search-data");

  function clickSearchBtn() {
    searchBox.classList.add("active");
    searchBtn.classList.add("active");
    searchInput.classList.add("active");
    cancelBtn.classList.add("active");
    searchInput.focus();
    if (searchInput.value != "") {
      var values = searchInput.value;
      searchData.classList.remove("active");
      searchData.innerHTML =
        "You just typed " +
        "<span style='font-weight: 500;'>" +
        values +
        "</span>";
    } else {
      searchData.textContent = "";
    }
  }

  function changePerElection() {
    if (userIsLoading) {
      return <div>loading...</div>;
    }

    if (!userIsLoading && isLogged()) {
      if (election == "chat") {
        return <ChatDashboard />;
      } else if (election == "users") {
        return <UsersDashboard />;
      } else if (election == "rooms") {
        return <RoomsDashboard />;
      }
    }
  }

  useEffect(() => {
    if (isLogged()) {
      console.log("Owo");
      if (election == "chat") {
        document.getElementsByClassName("active")[0].classList.remove("active");
        document.getElementById("chat").classList.add("active");
      }
      if (election == "users") {
        document.getElementsByClassName("active")[0].classList.remove("active");
        document.getElementById("users").classList.add("active");
      }
      if (election == "rooms") {
        document.getElementsByClassName("active")[0].classList.remove("active");
        document.getElementById("rooms").classList.add("active");
      }
    }
  }, [election]);

  function changeElection(id) {
    if (id == "chat") {
      setElection("chat");
    } else if (id == "rooms") {
      setElection("rooms");
    } else {
      setElection("users");
    }
  }

  function main() {
    if (isLogged()) {
      return (
        <div className="sidebar">
          <div className="sidebarMenu" style={{ paddingTop: "10px" }}>
            <div
              className="election"
              style={{
                width: "100%",
                height: "30px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                id="chat"
                className="electionButtons active"
                onClick={(e) => changeElection(e.target.id)}
              >
                chats
              </button>
              <button
                id="rooms"
                className="electionButtons"
                onClick={(e) => changeElection(e.target.id)}
              >
                rooms
              </button>
              <button
                id="users"
                className="electionButtons"
                onClick={(e) => changeElection(e.target.id)}
              >
                users
              </button>
            </div>
            <div
              class="search-box"
              style={{ display: "block", marginLeft: "auto" }}
            >
              <input type="text" placeholder="Buscar" />
              <div class="search-icon" onClick={(e) => clickSearchBtn(e)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>

              <div className="search-data"></div>
            </div>
            {changePerElection()}
          </div>
        </div>
      );
    }
  }
  return main();
}
