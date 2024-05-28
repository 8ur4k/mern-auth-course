import { InferSchemaType, Schema, model } from "mongoose";

const deletedNoteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  text: { type: String },
  deletedAt: { type: Date, default: Date.now, expires: "1m" },
});

type DeletedNote = InferSchemaType<typeof deletedNoteSchema>;

export default model<DeletedNote>("DeletedNote", deletedNoteSchema);
