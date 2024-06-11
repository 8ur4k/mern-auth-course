import { useState, useEffect } from "react";
import { Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import { TrashedNote as TrashedNoteModel } from "../models/trashedNote";
import * as NotesApi from "../network/notes_api";
import styles from "../styles/TrashedNote.module.css";
import TrashedNote from "./TrashedNote";
import useTrashCountStore from "../store/trashCountStore";

const TrashPageLoggedinView = () => {
  const [trashedNotes, setTrashedNotes] = useState<TrashedNoteModel[]>([]);
  const [trashedNotesLoading, setTrashedNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<TrashedNoteModel | null>(
    null
  );

  const { decrement } = useTrashCountStore();

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setTrashedNotesLoading(true);
        const trashedNotes = await NotesApi.fetchTrashedNotes();
        setTrashedNotes(trashedNotes);
      } catch (error) {
        console.error(error);
        alert(error);
        setShowNotesLoadingError(true);
      } finally {
        setTrashedNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote() {
    if (!noteToDelete) return;
    try {
      setTrashedNotes(
        trashedNotes.filter(
          (existingNote) => existingNote._id !== noteToDelete._id
        )
      );
      decrement();
      await NotesApi.deleteNote(noteToDelete._id);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  }

  async function restoreNote(note: TrashedNoteModel) {
    try {
      setTrashedNotes(
        trashedNotes.filter((existingNote) => existingNote._id !== note._id)
      );
      decrement();
      await NotesApi.restoreNote(note._id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleDeleteClick = (note: TrashedNoteModel) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {trashedNotes.map((note) => (
        <Col key={note._id}>
          <TrashedNote
            note={note}
            onDelete={handleDeleteClick}
            onRestore={restoreNote}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {trashedNotesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && (
        <p>Something went wrong. Please refresh the page</p>
      )}
      {!trashedNotesLoading && !showNotesLoadingError && (
        <>{trashedNotes.length > 0 ? notesGrid : <p>Trash is empty</p>}</>
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
          <Button variant="danger" onClick={deleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrashPageLoggedinView;
