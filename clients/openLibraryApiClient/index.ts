import * as R from "ramda";
import * as qs from "querystring";
import * as Wreck from "@hapi/wreck";

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

  const { payload } = await openLibClient.get<Response>(
    `search.json?${searchString}`
  );

  type IsbnBook = {
    isbn: string[];
  };

  type Response = {
    docs: IsbnBook[];
  };

  const extractIsbnList = (res: Response) => {
    const ebookList = R.path(["payload", "docs"], res) as IsbnBook[];

    const isbnList = R.pluck("isbn", ebookList);

    const uniqueIsbnList = R.uniq(isbnList);

    const filterEmpty = uniqueIsbnList.filter((x) => x);

    return R.flatten(filterEmpty);
  };

  const availableIsbnsFromSearch = extractIsbnList(payload);

  const splitAvailableIsbns = R.splitEvery(
    MAX_ISBN_COUNT,
    availableIsbnsFromSearch
  );

  const completeCanReadList = [];

  for (const isbnGroup of splitAvailableIsbns) {
    try {
      const booksCanRead = await searchByIsbn(isbnGroup);
      completeCanReadList.push(booksCanRead);
    } catch (error) {
      console.error(error);
    }
  }

  return R.flatten(completeCanReadList);
};

export const searchByIsbn = async (isbnArr: string[]) => {
  // testing url http://localhost:3000/api/search/0716716437

  type IsbnRecord = {
    [key: string]: Work[];
  };

  const { payload } = await openLibReadApiMultiRequest.get<any>(
    R.join("|", isbnArr)
  );

  const records = R.map(R.prop("records"));

  const payloadRecords = records(payload);

  const payloadValues = R.values(payloadRecords) as any[];

  const payloadMergedValues = R.mergeAll(payloadValues);

  return R.values(payloadMergedValues);
};

export const searchByOlid = async (olid: string) => {
  // https://openlibrary.org/api/volumes/brief/olid/OL22597358M.json

  const { payload } = await openLibReadApiOlid.get<any>(`${olid}.json`);

  const records = R.prop("records");
  const payloadRecords = records(payload) as object[];
  return R.values(payloadRecords) as object[];
};

export const filterAvailableBooks = (booksArr: any[]) => {
  type LendableItem = {
    availability: string;
  };

  type OpenLibraryBookResource = {
    data: { ebooks: LendableItem[] };
  };

  const isEbookAvailable = (book: OpenLibraryBookResource) => {
    const ebooksList = R.path(["data", "ebooks"], book) as LendableItem[];

    const isAvailable = (bookArr: LendableItem[]) =>
      bookArr.some((book) => book.availability !== "restricted");

    return isAvailable(ebooksList ?? []);
  };

  const availableRecords = R.filter(isEbookAvailable, booksArr);

  const bookData = R.pluck("data", availableRecords);

  const omitSubjects = R.map(R.omit(["subjects"]));

  return R.uniq(omitSubjects(bookData));
};
