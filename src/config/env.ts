// Configurações de ambiente
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  appName: import.meta.env.VITE_APP_NAME || 'AureaVox Jam Band',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

// Tipos para as variáveis de ambiente
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
