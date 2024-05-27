import { Card, Button } from "react-bootstrap";

interface UserProps {
  username: string;
  email?: string;
}

const ProfileAuthCard = (user: UserProps) => {
  return (
    <Card style={{ width: "25rem" }}>
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

export default ProfileAuthCard;
