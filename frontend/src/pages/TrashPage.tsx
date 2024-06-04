import { Container } from "react-bootstrap";
import TrashPageLoggedinView from "../components/TrashPageLoggedinView";
import TrashPageLoggedOutView from "../components/TrashPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/TrashPage.module.css";

interface TrashPageProps {
  loggedInUser: User | null;
}

const TrashPage = ({ loggedInUser }: TrashPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>
        {loggedInUser ? <TrashPageLoggedinView /> : <TrashPageLoggedOutView />}
      </>
    </Container>
  );
};

export default TrashPage;
