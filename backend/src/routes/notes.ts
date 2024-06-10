import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

router.get("/", NotesController.getNotes);

router.get("/trash", NotesController.getDeletedNotes);

router.post("/trash/restore/:noteId", NotesController.restoreNote);

router.delete("/trash/:noteId", NotesController.deleteNote);

router.get("/:noteId", NotesController.getNote);

router.post("/", NotesController.createNote);

router.patch("/:noteId", NotesController.updateNote);

router.post("/:noteId/trash", NotesController.trashNote);

export default router;
