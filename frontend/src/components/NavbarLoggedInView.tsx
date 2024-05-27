import { Button } from "react-bootstrap";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import { useNavigate } from "react-router-dom";

interface NavbarLoggeinViewProps {
  user: User;
  onLogoutSuccessfull: () => void;
}

const NavbarLoggeinView = ({
  user,
  onLogoutSuccessfull,
}: NavbarLoggeinViewProps) => {
  const navigate = useNavigate();

  async function logout() {
    try {
      await UserApi.logout();
      onLogoutSuccessfull();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          navigate(`/users/${user.username}`);
        }}
      >
        {user.username}
      </Button>
      <Button onClick={logout}>Log out</Button>
    </>
  );
};

export default NavbarLoggeinView;
