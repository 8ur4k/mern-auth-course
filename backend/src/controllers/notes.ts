import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import * as z from "zod";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({
      userId: authenticatedUserId,
      deletedAt: null,
    }).exec();
    console.log(notes);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

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

const CreateNoteBodySchema = z.object({ title: z.string(), text: z.string() });

export const createNote: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { data, error } = CreateNoteBodySchema.safeParse(req.body);
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

const UpdateNoteBodySchema = z.object({
  title: z.string(),
  text: z.string().optional(),
});

const UpdateNoteParamsSchema = z.object({
  noteId: z.string(),
});

export const updateNote: RequestHandler = async (req, res, next) => {
  const { noteId } = UpdateNoteParamsSchema.parse(req.params);
  const { data, error } = UpdateNoteBodySchema.safeParse(req.body);
  if (error) {
    throw createHttpError(400, "Invalid parameters");
  }
  const newTitle = data.title;
  const newText = data.text;
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

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

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
    console.log(notes);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const restoreDeletedNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

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

export const permaDeleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

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
