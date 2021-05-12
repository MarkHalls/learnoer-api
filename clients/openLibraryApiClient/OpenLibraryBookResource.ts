export type LendableItem = {
  availability: string;
};

export type OpenLibraryBookResource = {
  data: {
    ebooks?: LendableItem[];
    key: string;
    title: string;
  };
  details: {};
  isbns: string[];
};
