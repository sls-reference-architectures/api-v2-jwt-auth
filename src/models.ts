export interface CreateTokenRequest {
  clientId: string;
  clientSecret: string;
}

export interface AccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}
