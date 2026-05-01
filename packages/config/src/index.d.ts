export declare const env: {
  NODE_ENV: 'production' | 'development';
  PORT: number;
  DATABASE_URL: string;
  BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
};
export declare const dbConfig: {
  readonly url: string;
};
export declare const authConfig: {
  readonly googleAuth: {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly callbackUrl: string;
  };
};
export declare const appConfig: {
  readonly nodeEnv: 'production' | 'development';
  readonly port: number;
  readonly baseUrl: string;
  readonly frontendUrl: string;
};
//# sourceMappingURL=index.d.ts.map
