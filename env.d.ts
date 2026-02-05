// Fix: Removed problematic triple-slash reference to 'vite/client' which was causing a "Cannot find type definition file" error.
// The manual declaration of NodeJS.ProcessEnv below is sufficient to type the injected environment variables.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
