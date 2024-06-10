import { Note } from "../models/note";
import { DeletedNote } from "../models/deletedNote";
import { fetchData } from "./fetch_data";

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes", {
    method: "GET",
  });

  const notes = await response.json();
  const filteredNotes = notes.filter(
    (note: DeletedNote) => note.deletedAt === undefined
  );

  return filteredNotes;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData("/api/notes/" + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

export async function trashNote(noteId: string) {
  await fetchData(`/api/notes/${noteId}/trash`, { method: "POST" });
}

export async function fetcDeletedNotes(): Promise<DeletedNote[]> {
  const response = await fetchData("/api/notes/trash", {
    method: "GET",
  });

  const notes = await response.json();
  const filteredNotes = notes.filter(
    (note: DeletedNote) => note.deletedAt !== null
  );

  return filteredNotes;
}

export async function restoreDeletedNote(noteId: string): Promise<Note> {
  const response = await fetchData("/api/notes/trash/" + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function deleteNote(noteId: string) {
  await fetchData("/api/notes/trash/" + noteId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
