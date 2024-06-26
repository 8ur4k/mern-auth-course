import app from "./app";
import env from "../src/util/validateEnv";
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(env.PORT!, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch(console.error);
