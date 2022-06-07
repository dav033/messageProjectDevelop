import React, { useContext } from "react";
import { AuthContext } from "./authProvider";

function useAuth(props) {
  return useContext(AuthContext);
}

export default useAuth;
