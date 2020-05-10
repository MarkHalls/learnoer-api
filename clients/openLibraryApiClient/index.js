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

const searchByTitle = async (title) => {
  const searchString = qs.stringify({ title });

  const clientGet = (string) => openLibClient.get(string);

  const then = R.curry((fn, promise) => promise.then(fn));

  const getAvailableByIsbn = R.pipe(
    clientGet,
    then(
      R.pipe(
        R.path(["payload", "docs"]),
        R.defaultTo({}),
        R.filter(R.complement(R.pathEq(["availability", "status"], "error"))),
        R.pluck("isbn"),
        R.flatten
      )
    )
  );

  const availableIsbns = await getAvailableByIsbn(
    `search.json?${searchString}`
  );

  const booksCanRead = await searchByIsbn(availableIsbns);

  return booksCanRead;
};

const searchByIsbn = async (isbnArr) => {
  // testing url http://localhost:3000/api/search/0716716437

  const { payload } = await openLibReadApi.get(R.join("|", isbnArr));
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
  searchByTitle,
  searchByIsbn,
  filterAvailableBooks,
};
