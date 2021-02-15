import * as loki from "lokijs";
import * as path from "path";
import { Category, Entry } from "./type";
let db: loki;

export function getDb() {
  return db;
}

export function initializeDb(): Promise<loki> {
  return new Promise((resolve) => {
    // implement the autoloadback referenced in loki constructor
    const databaseInitialize = () => {
      let entries = db.getCollection<Entry>("entries");

      if (!entries) {
        console.log("Creating view");
        entries = db.addCollection<Entry>("entries", {
          indices: ["id"],
        });
      }

      let categories = db.getCollection<Category>("categories");

      if (!categories) {
        console.log("Creating view");
        categories = db.addCollection<Category>("categories", {
          indices: ["id"],
        });
      }

      // kick off any program logic or start listening to external events
      resolve(db);
    };

    db = new loki(path.join(__dirname, "../collection.db"), {
      autoload: true,
      autoloadCallback: databaseInitialize,
      autosave: true,

      autosaveInterval: 4000,
    });
  });
}
