import { BOOLEAN, INTEGER, Sequelize, STRING } from "sequelize";
import { CategoryInstance, EntryInstance } from "./type";

export const sequelize = new Sequelize(
  "postgres://oqolaaxggxrlch:799d3dea97557b0928404162426de477d4b3c55d15ad9b5c1f4fa3d1159626bf@ec2-52-203-27-62.compute-1.amazonaws.com:5432/de9q4fftp9s84i",
  {
    ssl: true,
    dialect: "postgres",
    protocol: "postgress",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export const CategoryModel = sequelize.define<CategoryInstance>("category", {
  id: {
    primaryKey: true,
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: STRING,
  },
});

export const EntryModel = sequelize.define<EntryInstance>("entry", {
  id: {
    primaryKey: true,
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: STRING,
  },
  isAcquired: {
    type: BOOLEAN,
  },
  image: {
    type: STRING,
    allowNull: true,
  },
});

EntryModel.belongsTo(CategoryModel);

export async function initializeDb(): Promise<void> {
  return sequelize.authenticate().then(() => {
    sequelize.sync();
  });
}
