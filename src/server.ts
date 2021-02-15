import * as express from "express";
import { getDb } from "./db";
import { Category, Entry } from "./type";
import * as bodyParser from "body-parser";
import { v4 } from "uuid";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "vash");

app.use("/assets", express.static("assets"));

app.post("/entries", async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    res.status(400);
    res.send("whoops");
    res.end();
  }

  const db = getDb();

  const items = db.getCollection<Entry>("entries");

  items.insert({
    id: v4(),
    cateogoryId: category,
    isAcquired: false,
    title: name,
  });

  res.redirect("/");
});

app.get("/acquire", async (req, res) => {
  const { id, val } = req.query;

  const db = getDb();
  const items = db.getCollection<Entry>("entries");
  const item = items.findOne({ id: id as string });

  if (!item) {
    res.status(404);
    res.send({});
    return;
  }

  items.update({
    ...item,
    isAcquired: val === "true",
  });

  res.status(200);
  res.send({});
});

app.get("/delete", async (req, res) => {
  const { id } = req.query;

  const db = getDb();
  const items = db.getCollection<Entry>("entries");
  const item = items.findOne({ id: id as string });

  if (!item) {
    res.status(404);
    res.send({});
    return;
  }

  items.remove(item);

  res.status(200);
  res.send({});
});

app.post("/categories", async (req, res) => {
  const categoryName = req.body.categoryName;

  if (!categoryName) {
    res.status(400);
    res.send("whoops");
    res.end();
  }

  const db = getDb();

  const categories = db.getCollection<Category>("categories");

  categories.insert({
    id: v4(),
    name: categoryName,
  });

  res.redirect("/");
});

app.get("/", async (req, res) => {
  const db = getDb();

  const categories = db.getCollection<Category>("categories");

  const items = db.getCollection<Entry>("entries").data.map((i) => {
    return {
      ...i,
      category: categories.where((c) => c.id === i.cateogoryId)[0],
    };
  });
  res.render("home", {
    items: items,
    count: items.length,
    categories: categories.data,
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
