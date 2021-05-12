import { OpenLibraryBookResource } from "../OpenLibraryBookResource";

export const hasAvailability = (book: OpenLibraryBookResource): boolean => {
  return (book.data.ebooks ?? []).some(
    (item) => item.availability !== "restricted"
  );
};

export const extractBookData = (bookArr: OpenLibraryBookResource[]) => {
  const dataArr = bookArr.map((book) => book.data);

  return deduplicateBy((x) => x.key, dataArr);
};

const deduplicateBy = <T>(prop: (arg: T) => string, objects: T[]): T[] => {
  const dict: { [key: string]: T } = {};

  for (const item of objects) {
    const key = prop(item);

    dict[key] = item;
  }

  return Object.values(dict);
};
