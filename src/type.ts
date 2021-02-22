import { Model, Optional } from "sequelize/types";

export type Category = {
  id: number;
  name: string;
};

export interface CategoryCreationAttributes extends Optional<Category, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
export interface CategoryInstance
  extends Model<Category, CategoryCreationAttributes>,
    Category {}

export type Entry = {
  id: number;
  title: string;
  isAcquired: boolean;
  image?: string;
  categoryId?: number;
};

export interface EntryCreationAttributes extends Optional<Entry, "id"> {}

// We need to declare an interface for our model that is basically what our class would be
export interface EntryInstance
  extends Model<Omit<Entry, "categoryId">, EntryCreationAttributes>,
    Entry {}
