import { Card, Button } from "react-bootstrap";
import styles from "../styles/LoggedInUserProfileCard.module.css";

interface UserProps {
  username: string;
  email: string;
}

const LoggedInUserProfileCard = (user: UserProps) => {
  return (
    <Card className={styles.profileCard}>
      <Card.Img src="/avatar-placeholder.jpg" />
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
