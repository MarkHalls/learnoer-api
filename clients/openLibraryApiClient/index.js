const R = require("ramda");
const qs = require("querystring");
const Wreck = require("@hapi/wreck");

const openLibClient = Wreck.defaults({
  baseUrl: "http://openlibrary.org/",
  json: true,
});

const openLibApiClient = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/",
  json: true,
});

const openLibReadApi = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/volumes/brief/json/",
  json: true,
});

const textSearch = async (searchTerm) => {
  const searchString = qs.stringify({
    q: searchTerm,
  });

  const searchResults = await openLibClient.get(`search.json?${searchString}`);

  const available = searchResults.payload.docs.filter(
    (book) => book.availability.status !== "error"
  );

  const availableIsbns = available.reduce((acc, book) => {
    if (book.isbn) {
      return [...acc, ...book.isbn];
    }
    return acc;
  }, []);

  const booksCanRead = await multiIsbnSearch(availableIsbns);
  return booksCanRead;
  //   return available;
};

const multiIsbnSearch = async (isbnArr) => {
  const query = isbnArr.join("|");
  const { payload } = await openLibReadApi.get(query);
  return payload;
};

const searchByIsbn = async (isbn) => {
  // testing url http://localhost:3000/api/search/0716716437
  // multiple isbns http://localhost:3000/api/search/1850899576%7C0716716437
  const { payload } = await openLibReadApi.get(isbn);
  const records = R.map(R.prop("records"));
  const makeBooksArr = R.pipe(records, R.values, R.mergeAll, R.values);

  return makeBooksArr(payload);
};

const filterAvailableBooks = (booksArr) => {
  const isRestricted = R.propEq("availability", "restricted");
  const isAvailable = R.complement(isRestricted);
  const hasAvailability = R.any(isAvailable);

  const recordHasAvailability = R.pipe(
    R.path(["data", "ebooks"]),
    R.defaultTo([]),
    hasAvailability
  );

  const availableRecords = R.filter(recordHasAvailability, booksArr);

  const bookData = R.pluck("data", availableRecords);

  const omitSubjects = R.map(R.omit(["subjects"]));

  return omitSubjects(bookData);
};

module.exports = {
  textSearch,
  isbnSearch: searchByIsbn,
  multiIsbnSearch,
};

// const isbnQuery = qs.stringify({
//   format: "json",
//   jscmd: "data",
//   bibkeys: `ISBN:${isbn}`,
// });

// const { payload } = await openLibApiClient.get(`books?${isbnQuery}`);

// return checkCanRead[isbn].records;

// const isbnKey = `ISBN:${isbn}`;
// const foundBooks = await textSearch(payload[isbnKey].title);
// console.log(R.keys(foundBooks));
// const moreFoundBooks = await multiIsbnSearch(R.keys(foundBooks));
// console.log(moreFoundBooks);
