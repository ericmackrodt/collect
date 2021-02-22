import * as bodyParser from "body-parser";
import * as express from "express";
import { CategoryModel, EntryModel } from "./db";

const app = express();

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

  const entry = await EntryModel.create({
    isAcquired: false,
    title: name,
    categoryId: parseInt(category),
  });

  await entry.save();

  // await sequelize.sync({ force: true });

  res.redirect("/");
});

app.get("/acquire", async (req, res) => {
  const { id, val } = req.query;

  await EntryModel.update(
    {
      isAcquired: val === "true",
    },
    { where: { id: parseInt(id as string) } }
  );

  res.status(200);
  res.send({});
});

app.get("/delete", async (req, res) => {
  const { id } = req.query;

  await EntryModel.destroy({ where: { id: parseInt(id as string) } });

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

  const category = await CategoryModel.create({
    name: categoryName,
  });

  await category.save();

  res.redirect("/");
});

app.get("/", async (req, res) => {
  const categories = await CategoryModel.findAll();

  const items = await EntryModel.findAll({
    include: [CategoryModel],
    order: [["id", "DESC"]],
  });

  const count = await EntryModel.count();

  res.render("home", {
    items,
    count,
    categories,
  });
});

export default app;
