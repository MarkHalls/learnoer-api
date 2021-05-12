import { searchByIsbn } from "./search/isbn";
import { searchByTitle } from "./search/title";
import { searchByOlid } from "./search/olid";
import { hasAvailability, extractBookData } from "./utils";

export const getBooksByTitleOrIsbn = async (term: string) => {
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

export const getBooksByOlid = async (olid: string) => {
  const foundBook = await searchByOlid(olid);

  return extractBookData(foundBook);
};
