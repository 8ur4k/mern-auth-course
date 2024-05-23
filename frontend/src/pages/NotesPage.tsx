import { Container } from "react-bootstrap";
import NotesPageLoggedinView from "../components/NotesPageLoggedinView";
import NotesPafeLoggedOutView from "../components/NotesPafeLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>
        {loggedInUser ? <NotesPageLoggedinView /> : <NotesPafeLoggedOutView />}
      </>
    </Container>
  );
};

export default NotesPage;
