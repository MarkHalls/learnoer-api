type GoogleCredentials = {
  kind: "google";
  openid: string;
};

type InternalCredentials = {
  kind: "internal";
  password: string;
};

export type Credentials = GoogleCredentials | InternalCredentials;

export type User = {
  id: string;
  email: string;
  display_name: string;
  credentials: Credentials;
  profile_img: string | null;
};
