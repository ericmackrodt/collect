import { initializeDb } from "./db";
import app from "./server";

const port = process.env.PORT || 3001;

initializeDb().then(async (db) => {
  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );
});
