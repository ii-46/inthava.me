import dotenv from "dotenv";

dotenv.config();

import app from "./app";

process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err);
  app.response.send(err);
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

