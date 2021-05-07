export type Book = BookFromTitle | BookFromIsbn | BookFromOlid;

// Book type returned from title search
type BookFromTitle = {
  author_alternative_name?: string[];
  author_key?: string[];
  author_name?: string[];
  contributor?: string[];
  cover_edition_key?: string;
  cover_i?: number;
  ddc?: string[];
  ebook_count_i: number;
  edition_count: number;
  edition_key?: string[];
  first_publish_year?: number;
  first_sentence?: string[];
  has_fulltext: boolean;
  ia?: string[];
  ia_box_id?: string[];
  ia_collection_s?: string;
  ia_loaded_id?: string[];
  id_alibris_id?: string[];
  id_amazon?: string[];
  id_bcid?: string[];
  id_canadian_national_library_archive?: string[];
  id_depósito_legal?: string[];
  id_goodreads?: string[];
  id_google?: string[];
  id_librarything?: string[];
  id_overdrive?: string[];
  id_paperback_swap?: string[];
  id_wikidata?: string[];
  key: string;
  language?: string[];
  last_modified_i: number;
  lcc?: string[];
  lccn?: string[];
  lending_edition_s?: string;
  lending_identifier_s?: string;
  oclc?: string[];
  person?: string[];
  place?: string[];
  printdisabled_s?: string;
  public_scan_b?: boolean;
  publish_date?: string[];
  publish_place?: string[];
  publish_year?: number[];
  publisher?: string[];
  seed: [];
  subject?: string[];
  subtitle?: string;
  text?: string[];
  time?: string[];
  title_suggest: string;
  type: string;
};

type UrlName = {
  name: string;
  url: string;
};

type Excerpt = {
  comment: string;
  first_sentence: boolean;
  text: string;
};

type BookIdentifiers = {
  goodreads: string[];
  isbn_10: string[];
  isbn_13: string[];
  librarything: string[];
  openlibrary: string[];
};

type Publisher = {
  name: string;
};

type CoverImage = {
  small: string;
  medium: string;
  large: string;
};

// Book type returned from isbn search
type BookFromIsbn = {
  authors: UrlName[];
  cover: CoverImage;
  excerpts: Excerpt[];
  identifiers: BookIdentifiers;
  key: string;
  publish_date: string;
  publishers: Publisher[];
  subject_people: UrlName[];
  subject_places: UrlName[];
  subjects: UrlName[];
  title: string;
  url: string;
  weight: string;
};

type Ebook = {
  availability: string;
  borrow_url: string;
  checkedout: boolean;
  formats: {};
  preview_url: string;
};

type Classifications = {
  dewey_decimal_class: string[];
  lc_classifications: string[];
};

// Book type returned from Olid search
type BookFromOlid = {
  authors: UrlName[];
  by_statement: string;
  classifications: Classifications;
  cover: CoverImage;
  ebooks: Ebook[];
  identifiers: BookIdentifiers;
  key: string;
  notes: string;
  number_of_pages: number;
  pagination: string;
  publish_date: string;
  publish_places: Publisher[];
  publishers: Publisher[];
  subject_people: UrlName[];
  subject_places: UrlName[];
  subjects: UrlName[];
  title: string;
  url: string;
};
