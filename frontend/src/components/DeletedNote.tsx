import styles from "../styles/Note.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { DeletedNote as DeletedNoteModel } from "../models/deletedNote";
import { MdDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";

function formatExpiresIn(deletedAt: string): string {
  const now = new Date();
  const deletedAtDate = new Date(deletedAt);

  const expiresAt = new Date(deletedAtDate.getTime() + 24 * 60 * 60 * 1000);
  const timeDifference = expiresAt.getTime() - now.getTime();

  if (timeDifference <= 0) {
    return "Expired";
  }

  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(minutesDifference / 60);

  if (hoursDifference >= 1) {
    return `${hoursDifference}h`;
  } else {
    return `${minutesDifference}m`;
  }
}

interface DeletedNoteProps {
  note: DeletedNoteModel;
  onDeleteNoteClicked: (note: DeletedNoteModel) => void;
  onRestoreNoteClicked: (note: DeletedNoteModel) => void;
  className?: string;
}

const DeletedNote = ({
  note,
  onDeleteNoteClicked,
  onRestoreNoteClicked,
  className,
}: DeletedNoteProps) => {
  const { title, text, deletedAt } = note;

  const ExpiresIn = "Expires in: " + formatExpiresIn(deletedAt);

  return (
    <Card className={`${styles.noteCard} ${className}`}>
      <Card.Body className={styles.cardBody}>
        <Card.Title className={stylesUtils.flexCenter}>
          {title}
          <div className="text muted ms-auto">
            <MdOutlineSettingsBackupRestore
              onClick={(e) => {
                onRestoreNoteClicked(note);
                e.stopPropagation();
              }}
            />
            <MdDelete
              onClick={(e) => {
                onDeleteNoteClicked(note);
                e.stopPropagation();
              }}
            />
          </div>
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{ExpiresIn}</Card.Footer>
    </Card>
  );
};

export default DeletedNote;
