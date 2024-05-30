import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { DeletedNote as DeletedNoteModel } from "../models/deletedNote";
import * as NotesApi from "../network/notes_api";
import styles from "../styles/NotesPage.module.css";
import DeletedNote from "./DeletedNote";
import useTrashCountStore from "../store/trashCountStore";

const TrashPageLoggedinView = () => {
  const [deletedNotes, setDeletedNotes] = useState<DeletedNoteModel[]>([]);
  const [deletedNotesLoading, setDeletedNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const { decrement } = useTrashCountStore();

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setDeletedNotesLoading(true);
        const deletedNotes = await NotesApi.fetcDeletedNotes();
        setDeletedNotes(deletedNotes);
      } catch (error) {
        console.error(error);
        alert(error);
        setShowNotesLoadingError(true);
      } finally {
        setDeletedNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function permaDeleteNote(note: DeletedNoteModel) {
    try {
      setDeletedNotes(
        deletedNotes.filter((existingNote) => existingNote._id !== note._id)
      );
      decrement();
      await NotesApi.permaDeleteNote(note._id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function restoreDeletedNote(note: DeletedNoteModel) {
    try {
      setDeletedNotes(
        deletedNotes.filter((existingNote) => existingNote._id !== note._id)
      );
      decrement();
      await NotesApi.restoreDeletedNote(note._id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {deletedNotes.map((note) => (
        <Col key={note._id}>
          <DeletedNote
            note={note}
            className={styles.note}
            onDeleteNoteClicked={permaDeleteNote}
            onRestoreNoteClicked={restoreDeletedNote}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {deletedNotesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && (
        <p>Something went wrong. Please refresh the page</p>
      )}
      {!deletedNotesLoading && !showNotesLoadingError && (
        <>{deletedNotes.length > 0 ? notesGrid : <p>Trash is empty</p>}</>
      )}
    </>
  );
};

export default TrashPageLoggedinView;
