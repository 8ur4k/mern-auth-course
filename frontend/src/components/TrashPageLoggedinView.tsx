
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
            onDeleteNoteClicked={permaDeleteNote}
