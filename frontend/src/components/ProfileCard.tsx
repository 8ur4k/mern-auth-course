import { Card, Button } from "react-bootstrap";
import styles from "../styles/ProfileCard.module.css";

interface UserProps {
  username: string;
  email?: string;
}

const ProfileCard = (user: UserProps) => {
  return (
    <Card className={styles.profileCard}>
      <Card.Img src="/avatar-placeholder.jpg" />
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Text>Hi there! I'm using EstebaNotes.🙋</Card.Text>
        <Button className="mt-5" variant="primary">
          Add as collaborator
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
