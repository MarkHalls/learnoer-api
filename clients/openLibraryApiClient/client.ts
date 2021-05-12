import Wreck from "@hapi/wreck";

export const openLibClient = Wreck.defaults({
  baseUrl: "http://openlibrary.org/",
  json: true,
});

export const openLibApiClient = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/",
  json: true,
});

// https://openlibrary.org/api/volumes/brief/json/0716716437
export const openLibReadApiMultiRequest = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/volumes/brief/json/",
  json: true,
});

export const openLibReadApiOlid = Wreck.defaults({
  baseUrl: "https://openlibrary.org/api/volumes/brief/olid/",
  json: true,
});
