import { useState, useEffect } from "react";
import { Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import { DeletedNote as DeletedNoteModel } from "../models/deletedNote";
import * as NotesApi from "../network/notes_api";
import styles from "../styles/TrashPage.module.css";
import DeletedNote from "./DeletedNote";
import useTrashCountStore from "../store/trashCountStore";

const TrashPageLoggedinView = () => {
  const [deletedNotes, setDeletedNotes] = useState<DeletedNoteModel[]>([]);
  const [deletedNotesLoading, setDeletedNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToTrash, setNoteToTrash] = useState<DeletedNoteModel | null>(null);

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

  async function permaDeleteNote() {
    if (!noteToTrash) return;
    try {
      setDeletedNotes(
        deletedNotes.filter(
          (existingNote) => existingNote._id !== noteToTrash._id
        )
      );
      decrement();
      await NotesApi.permaDeleteNote(noteToTrash._id);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setShowDeleteModal(false);
      setNoteToTrash(null);
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

  const handleTrashClick = (note: DeletedNoteModel) => {
    setNoteToTrash(note);
    setShowDeleteModal(true);
  };

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {deletedNotes.map((note) => (
        <Col key={note._id}>
          <DeletedNote
            note={note}
            className={styles.note}
            onTrashNoteClicked={handleTrashClick}
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this note?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={permaDeleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrashPageLoggedinView;
