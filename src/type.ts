export type Category = {
  id: string;
  name: string;
};

export type Entry = {
  id: string;
  title: string;
  isAcquired: boolean;
  image?: string;
  cateogoryId: string;
};
