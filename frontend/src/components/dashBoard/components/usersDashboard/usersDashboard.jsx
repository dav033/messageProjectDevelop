import "./usersDashboard.scss";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getUsersLessOne } from "../../../../petitions";
import useAuth from "../../../../auth/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListComponent from "../../../listComponent/listComponent";
export default function UsersDashboard(props) {
  const queryClient = useQueryClient();
  const { userData, setChatAux } = useAuth();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery(
    ["prueba", "getUsers", userData],
    async () => await getUsersLessOne(userData._id),
    {
      keepPreviousData: true,
    }
  );

  const enterProvisionalChat = (userId) => {
    console.log(userId);
    setChatAux(userId);
    navigate(`/privateChat`);
  };

  const main = () => {
    if (users) {
      if (users.length != 0) {
        return users.map((user) => {
          return (
            <ListComponent
              text={user.userName}
              onClickFunction={() => enterProvisionalChat(user._id)}
            />
          );
        });
      } else {
        return <div>No hay usuarios</div>;
      }
    } else {
      return <div>No hay usuarios</div>;
    }
  };

  return <div className="usersDashboard">{main()}</div>;
}
