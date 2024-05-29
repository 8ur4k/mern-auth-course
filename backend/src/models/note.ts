import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String },
    deletedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

noteSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 10 });

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
