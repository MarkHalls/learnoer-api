import * as qs from "querystring";

import { openLibClient } from "../client";
import { searchByIsbn } from "./isbn";

import { OpenLibraryBookResource } from "../OpenLibraryBookResource";

// Maximum number of ISBNs a url string can hold when appended to api search
const MAX_ISBN_COUNT = 260;

export const searchByTitle = async (
  title: string
): Promise<OpenLibraryBookResource[]> => {
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
