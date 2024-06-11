import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavbarLoggeinView from "./NavbarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
  loggedInUser: User | null;
  trashLength: Number;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onlogoutSuccessful: () => void;
}

const NavBar = ({
  loggedInUser,
  trashLength,
  onSignUpClicked,
  onLoginClicked,
  onlogoutSuccessful,
}: NavBarProps) => {
  return (
    <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          EstebaNotes
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} to="/privacy">
              Privacy
            </Nav.Link>
            <Nav.Link as={Link} to="/trash">
              {`Trash(${trashLength})`}
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavbarLoggeinView
                user={loggedInUser}
                onLogoutSuccessfull={onlogoutSuccessful}
              />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
