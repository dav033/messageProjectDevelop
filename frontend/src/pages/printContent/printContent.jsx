import "./printContent.scss";
import useAuth from "../../auth/useAuth";

export default function PrintContent({ children }) {
  const { userLoading, userData, isLogged } = useAuth();

  const main = () => {
    if (!userLoading) {
      return (
        <div className="aa" style={{ backgroundColor: "", float: "4" }}>
          {children}
        </div>
      );
    }
  };

  return main();
}
