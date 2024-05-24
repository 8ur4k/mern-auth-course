import { Button, Navbar, Nav } from "react-bootstrap";
import { User } from "../models/user";
import * as UserApi from "../network/users_api";
import { Link } from "react-router-dom";

interface NavbarLoggeinViewProps {
  user: User;
  onLogoutSuccessfull: () => void;
}

const NavbarLoggeinView = ({
  user,
  onLogoutSuccessfull,
}: NavbarLoggeinViewProps) => {
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
      <Navbar.Text className="me-2">
        <Button>
          <Nav.Link as={Link} to={`/users/${user.username}`}>
            {user.username}
          </Nav.Link>
        </Button>
      </Navbar.Text>
      <Button onClick={logout}>Log out</Button>
    </>
  );
};

export default NavbarLoggeinView;
