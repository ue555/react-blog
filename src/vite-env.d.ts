/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MAINTENANCE_MODE: string; // "true" | "false"
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
