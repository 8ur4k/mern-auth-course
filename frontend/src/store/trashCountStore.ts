import { create } from "zustand";
import * as NotesApi from "../network/notes_api";

async function fetchTrashCount() {
  return (await NotesApi.fetchTrashedNotes()).length;
}

interface TrashCountState {
  count: number;
  increment: () => void;
  decrement: () => void;
  setCount: (count: number) => void;
}

const useTrashCountStore = create<TrashCountState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setCount: (count: number) => set({ count }),
}));

fetchTrashCount().then((count) => {
  useTrashCountStore.getState().setCount(count);
});

export default useTrashCountStore;
