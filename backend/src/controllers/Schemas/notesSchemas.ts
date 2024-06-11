import * as z from "zod";

export const GetNoteParamsSchema = z.object({
  noteId: z.string(),
});

export const CreateNoteBodySchema = z.object({
  title: z.string(),
  text: z.string(),
});

export const UpdateNoteBodySchema = z.object({
  title: z.string(),
  text: z.string().optional(),
});

export const UpdateNoteParamsSchema = z.object({
  noteId: z.string(),
});

export const TrashNoteParamsSchema = z.object({
  noteId: z.string(),
});

export const RestoreNoteSchema = z.object({
  noteId: z.string(),
});

export const DeleteNoteSchema = z.object({
  noteId: z.string(),
});