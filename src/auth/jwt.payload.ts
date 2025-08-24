export type PayloadType = {
  sub: string;
  iat: number;
  exp: number;
};

export type SignupPayloadType = {
  sub: number; // oauthId
  email: string;
  image: string;
  iat: number;
  exp: number;
};
