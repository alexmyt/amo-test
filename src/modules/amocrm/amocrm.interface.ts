export interface RedirectRequestQuery {
  client_id: string;
  code: string;
}

type GrantTypeAuthCode = {
  grant_type: 'authorization_code';
  code: string;
  refresh_token?: never;
};

type GrantTypeRefreshToken = {
  grant_type: 'refresh_token';
  refresh_token: string;
  code?: never;
};

export type OAuthGrantType = GrantTypeAuthCode | GrantTypeRefreshToken;

export type OAuthRequestPayload = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
} & OAuthGrantType;

export interface OAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}
