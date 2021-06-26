import got from "got";

export const openLibClient = got.extend({
  prefixUrl: "https://openlibrary.org/",
  responseType: "json",
});

export const openLibApiClient = got.extend({
  prefixUrl: "https://openlibrary.org/api/",
  responseType: "json",
});

// https://openlibrary.org/api/volumes/brief/json/0716716437
export const openLibReadApiMultiRequest = got.extend({
  prefixUrl: "https://openlibrary.org/api/volumes/brief/json/",
  responseType: "json",
});

export const openLibReadApiOlid = got.extend({
  prefixUrl: "https://openlibrary.org/api/volumes/brief/olid/",
  responseType: "json",
});
