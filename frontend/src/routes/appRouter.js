import ReactDOM from "react-dom/client";
import Home from "../pages/home/home.jsx";
import NavBar from "../components/navBar/navBar.jsx";
import Login from "../pages/login/login.jsx";
import Register from "../pages/register/register.jsx";
import Test from "../pages/test/test.jsx";
import useAuth from "../auth/useAuth.js";
import RequireAuth from "./RequireAuth.js";
import LoggedRoutes from "./loggedRoutes.js";
import MessageInterface from "../pages/messagesInterface/messageInterface.jsx";
import Dashboard from "../components/dashBoard/dashboard.jsx";
import PrintContent from "../pages/printContent/printContent.jsx";
import ProvitionalChat from "../pages/provitionalChat/provitionalChat.jsx";
import { Suspense, lazy } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Room from "../pages/room/room.jsx";
import PrivateChat from "../pages/privateChat/privateChat.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavBar></NavBar>
      <div className="cont">
        <Dashboard></Dashboard>
        <PrintContent>
          <Routes>
            <Route
              path="/login"
              element={
                <LoggedRoutes>
                  <Login />
                </LoggedRoutes>
              }
            />{" "}
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={
                <LoggedRoutes>
                  <Register />
                </LoggedRoutes>
              }
            />
            <Route
              path="/test"
              element={
                <RequireAuth>
                  <Test />
                </RequireAuth>
              }
            />
            <Route
              path="/messages"
              element={
                <RequireAuth>
                  <MessageInterface />
                </RequireAuth>
              }
            />
            <Route
              path="/room/:id"
              element={
                <RequireAuth>
                  <Room />
                </RequireAuth>
              }
            />
            <Route
              path="/privateChat"
              element={
                <RequireAuth>
                  <ProvitionalChat />
                </RequireAuth>
              }
            />
            <Route
              path="/privateChat/:id"
              element={
                <RequireAuth>
                  <PrivateChat />
                </RequireAuth>
              }
            />
          </Routes>
        </PrintContent>
      </div>
    </BrowserRouter>
  );
}
