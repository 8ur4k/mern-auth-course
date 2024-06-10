import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";
import * as schemas from "./Schemas/notesSchemas";

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({
      userId: authenticatedUserId,
      deletedAt: null,
    }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const { data, error } = schemas.GetNoteParamsSchema.safeParse(req.params);
  const authenticatedUserId = req.session.userId;

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { noteId } = data;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { data, error } = schemas.CreateNoteBodySchema.safeParse(req.body);

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { title, text } = data;

  try {
    assertIsDefined(authenticatedUserId);

    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  const { data: paramsData, error: paramsError } =
    schemas.UpdateNoteParamsSchema.safeParse(req.params);
  const { data: bodyData, error: bodyError } =
    schemas.UpdateNoteBodySchema.safeParse(req.body);

  if (bodyError || paramsError) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { noteId } = paramsData;
  const { text: newText, title: newTitle } = bodyData;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const trashNote: RequestHandler = async (req, res, next) => {
  const { data, error } = schemas.TrashNoteParamsSchema.safeParse(req.params);
  const authenticatedUserId = req.session.userId;

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { noteId } = data;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    note.deletedAt = new Date();

    await note.save();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getDeletedNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({
      userId: authenticatedUserId,
      deletedAt: { $ne: null },
    }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const restoreNote: RequestHandler = async (req, res, next) => {
  const { data, error } = schemas.RestoreNoteSchema.safeParse(req.params);
  const authenticatedUserId = req.session.userId;

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { noteId } = data;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await NoteModel.findByIdAndUpdate(noteId, { $unset: { deletedAt: 1 } });

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const { data, error } = schemas.DeleteNoteSchema.safeParse(req.params);
  const authenticatedUserId = req.session.userId;

  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }

  const { noteId } = data;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await note.remove();

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
