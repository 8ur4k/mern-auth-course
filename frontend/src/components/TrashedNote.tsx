import styles from "../styles/TrashedNote.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { TrashedNote as TrashedNoteModel } from "../models/trashedNote";
import { MdDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";

function formatExpiresIn(trashedAt: string): string {
  const now = new Date();
  const trashedAtDate = new Date(trashedAt);

  const expiresAt = new Date(trashedAtDate.getTime() + 24 * 60 * 60 * 1000);
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

interface TrashedNoteProps {
  note: TrashedNoteModel;
  onDelete: (note: TrashedNoteModel) => void;
  onRestore: (note: TrashedNoteModel) => void;
}

const TrashedNote = ({ note, onDelete, onRestore }: TrashedNoteProps) => {
  const { title, text, trashedAt } = note;

  const expiresIn = "Expires in: " + formatExpiresIn(trashedAt);

  return (
    <Card className={`${styles.noteCard} ${styles.note}`}>
      <Card.Body className={styles.cardBody}>
        <Card.Title className={stylesUtils.flexCenter}>
          {title}
          <div className="text muted ms-auto">
            <MdOutlineSettingsBackupRestore
              onClick={(e) => {
                onRestore(note);
                e.stopPropagation();
              }}
            />
            <MdDelete
              onClick={(e) => {
                onDelete(note);
                e.stopPropagation();
              }}
            />
          </div>
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{expiresIn}</Card.Footer>
    </Card>
  );
};

export default TrashedNote;
