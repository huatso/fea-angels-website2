/**
 * Configuração pública do site lida de variáveis de ambiente (VITE_*).
 * Use `env.X` em vez de `import.meta.env.VITE_X` em qualquer lugar do código.
 *
 * NUNCA importe segredos aqui — somente valores não-secretos vão pro bundle do navegador.
 */

const get = (key: string, fallback = "") =>
  (import.meta.env[key] as string | undefined)?.trim() || fallback;

export const env = {
  SITE_NAME: get("VITE_SITE_NAME", "FEA Angels"),
  SITE_DESCRIPTION: get(
    "VITE_SITE_DESCRIPTION",
    "Transformando o empreendedorismo por meio do investimento anjo",
  ),

  ADDRESS: get(
    "VITE_ADDRESS",
    "Av. Prof. Luciano Gualberto, 908 - Butantã, São Paulo - SP",
  ),
  MAPS_EMBED_URL: get(
    "VITE_MAPS_EMBED_URL",
    "https://www.google.com/maps?q=Av.+Prof.+Luciano+Gualberto,+908,+S%C3%A3o+Paulo&output=embed",
  ),

  CONTACT_EMAIL: get("VITE_CONTACT_EMAIL", "contato@feaangels.com.br"),
  CONTACT_PHONE: get("VITE_CONTACT_PHONE", "+55 11 99999-9999"),

  SOCIAL_INSTAGRAM: get("VITE_SOCIAL_INSTAGRAM"),
  SOCIAL_LINKEDIN: get("VITE_SOCIAL_LINKEDIN"),
  SOCIAL_YOUTUBE: get("VITE_SOCIAL_YOUTUBE"),

  CHAT_MODEL: get("VITE_CHAT_MODEL", "google/gemini-3-flash-preview"),
};
