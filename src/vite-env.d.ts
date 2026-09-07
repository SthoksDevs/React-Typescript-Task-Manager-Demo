/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Not read anywhere yet — the mock service layer doesn't need it.
   * It's declared here so the type is ready the moment `taskService.ts`
   * is pointed at a real backend. See `.env.example`.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
