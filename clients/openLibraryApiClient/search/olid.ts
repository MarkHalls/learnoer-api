import { OpenLibraryBookResource } from "../OpenLibraryBookResource";
import { openLibReadApiOlid } from "../client";

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
