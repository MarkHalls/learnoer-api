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

const isbnSearch = async (isbn) => {
  //we need to make 2 api calls to get the availability of the book to read
  const isbnQuery = qs.stringify({
    format: "json",
    jscmd: "data",
    bibkeys: `ISBN:${isbn}`,
  });

  const { payload } = await openLibApiClient.get(`books?${isbnQuery}`);

  const checkCanRead = await multiIsbnSearch([isbn]);

  const bookDetails = Object.entries(checkCanRead[isbn].records).map((book) =>
    console.log(book[1].data.ebooks)
  );
  console.log(bookDetails);
  return checkCanRead[isbn].records;

  const isbnKey = `ISBN:${isbn}`;

  console.log(payload[isbnKey].title);
  const foundBooks = textSearch(payload[isbnKey].title);

  return foundBooks;
};

module.exports = {
  textSearch,
  isbnSearch,
  multiIsbnSearch,
};
