import { OpenLibraryBookResource } from "../OpenLibraryBookResource";
import { openLibReadApiMultiRequest } from "../client";

export const searchByIsbn = async (
  isbnArr: string[]
): Promise<OpenLibraryBookResource[]> => {
  // testing url http://localhost:3000/api/search/0716716437

  type IsbnResponse = {
    [isbn: string]: {
      records: {
        [olid: string]: OpenLibraryBookResource;
      };
    };
  };

  const { body } = await openLibReadApiMultiRequest.get<IsbnResponse>(
    isbnArr.join("|")
  );

  const payloadValues = Object.values(body);

  const recordsArr = payloadValues.map((x) => x.records);

  const records = recordsArr.reduce((acc, item) => ({ ...acc, ...item }), {});

  return Object.values(records);
};
