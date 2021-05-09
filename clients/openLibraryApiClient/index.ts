import * as qs from "querystring";
import Wreck from "@hapi/wreck";

import { Book as Work } from "./book";

// Maximum number of ISBNs a url string can hold when appended to api search
const MAX_ISBN_COUNT = 260;

const openLibClient = Wreck.defaults({
  baseUrl: "http://openlibrary.org/",
  json: true,
});

const openLibApiClient = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/",
  json: true,
});

// https://openlibrary.org/api/volumes/brief/json/0716716437
const openLibReadApiMultiRequest = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/volumes/brief/json/",
  json: true,
});

const openLibReadApiOlid = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/volumes/brief/olid/",
  json: true,
});

export const searchByTitle = async (title: string) => {
  // http://openlibrary.org/search.json?title=dragonsong
  const searchString = qs.stringify({ title });

  type Response = {
    docs: IsbnBook[];
  };

  type IsbnBook = {
    isbn: string[];
  };

  const { payload } = await openLibClient.get<Response>(
    `search.json?${searchString}`
  );

  const extractIsbnList = (res: Response): string[] => {
    const isbnList = res.docs.flatMap((x) => x.isbn);

    return [...new Set(isbnList)].filter((x) => x);
  };

  const availableIsbnsFromSearch = extractIsbnList(payload);

  const splitIsbnByMaxCount = [];

  for (let i = 0; i < availableIsbnsFromSearch.length; i += MAX_ISBN_COUNT) {
    splitIsbnByMaxCount.push(
      availableIsbnsFromSearch.slice(i, i + MAX_ISBN_COUNT)
    );
  }

  const searchResults = [];

  for (const isbnGroup of splitIsbnByMaxCount) {
    try {
      const bookList = await searchByIsbn(isbnGroup);
      searchResults.push(...bookList);
    } catch (error) {
      console.error(error);
    }
  }

  return searchResults;
};

export const searchByIsbn = async (isbnArr: string[]) => {
  // testing url http://localhost:3000/api/search/0716716437

  type IsbnResponse = {
    [isbn: string]: {
      records: {
        [olid: string]: OpenLibraryBookResource;
      };
    };
  };

  const { payload } = await openLibReadApiMultiRequest.get<IsbnResponse>(
    isbnArr.join("|")
  );

  const payloadValues = Object.values(payload);

  const recordsArr = payloadValues.map((x) => x.records);

  const records = recordsArr.reduce((acc, item) => ({ ...acc, ...item }));

  return Object.values(records);
};

export const searchByOlid = async (olid: string) => {
  // https://openlibrary.org/api/volumes/brief/olid/OL22597358M.json
  type OlidResponse = {
    records: {
      [olid: string]: OpenLibraryBookResource;
    };
  };

  const { payload } = await openLibReadApiOlid.get<OlidResponse>(
    `${olid}.json`
  );

  return Object.values(payload.records);
};

type LendableItem = {
  availability: string;
};

type OpenLibraryBookResource = {
  data: {
    ebooks?: LendableItem[];
    key: string;
    title: string;
  };
  details: {};
  isbns: string[];
};

const hasAvailability = (book: OpenLibraryBookResource): boolean => {
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

export const search = async (term: string) => {
  const foundBooks = await searchByIsbn([term]);

  if (foundBooks.length === 0) {
    //assume the path was actually a title
    const books = await searchByTitle(term);
    const available = books.filter(hasAvailability);

    return extractBookData(available);
  }

  const availableBooks = foundBooks.filter(hasAvailability);

  if (availableBooks.length === 0) {
    const relatedBooks = await searchByTitle(foundBooks[0].data.title);

    const available = relatedBooks.filter(hasAvailability);

    return extractBookData(available);
  }

  return extractBookData(availableBooks);
};
