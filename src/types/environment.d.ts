declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      SOCKET_URL: string;
    }
  }
}

export {};
