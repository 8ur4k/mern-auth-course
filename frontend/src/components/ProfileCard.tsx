import { Card, Button } from "react-bootstrap";
import styles from "../styles/ProfileCard.module.css";

interface UserProps {
  username: string;
  email?: string;
}

const ProfileCard = (user: UserProps) => {
  return (
    <Card className={styles.profileCard}>
      <Card.Img
        variant="top"
        src="https://www.technopat.net/sosyal/eklenti/img-20190611-wa0005-jpg.404137/"
      />
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
