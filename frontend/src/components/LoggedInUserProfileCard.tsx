import { Card, Button } from "react-bootstrap";
import styles from "../styles/LoggedInUserProfileCard.module.css";

interface UserProps {
  username: string;
  email: string;
}

const LoggedInUserProfileCard = (user: UserProps) => {
  return (
    <Card className={styles.profileCard}>
      <Card.Img
        variant="top"
        src="https://www.technopat.net/sosyal/eklenti/img-20190611-wa0005-jpg.404137/"
      />
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Title>{user.email}</Card.Title>
        <Card.Text>Hi there! I'm using EstebaNotes.🙋</Card.Text>
        <Button variant="primary">Change Password</Button>
      </Card.Body>
    </Card>
  );
};

export default LoggedInUserProfileCard;
