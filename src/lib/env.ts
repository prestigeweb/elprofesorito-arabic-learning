/**
 * Environment variables configuration
 * 
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 * See: https://vitejs.dev/guide/env-and-mode.html
 */

interface EnvConfig {
  googleScriptUrl: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  appEnv: string;
}

/**
 * Type-safe environment variable accessor
 * Throws error if required environment variables are missing
 */
function getEnv(): EnvConfig {
  const googleScriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE;
  const contactWhatsapp = import.meta.env.VITE_CONTACT_WHATSAPP;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const appEnv = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development';

  // Validate required environment variables
  if (!googleScriptUrl) {
    throw new Error('VITE_GOOGLE_SCRIPT_URL is required but not set in environment variables');
  }

  if (!contactPhone) {
    throw new Error('VITE_CONTACT_PHONE is required but not set in environment variables');
  }

  if (!contactWhatsapp) {
    throw new Error('VITE_CONTACT_WHATSAPP is required but not set in environment variables');
  }

  if (!contactEmail) {
    throw new Error('VITE_CONTACT_EMAIL is required but not set in environment variables');
  }

  return {
    googleScriptUrl,
    contactPhone,
    contactWhatsapp,
    contactEmail,
    appEnv,
  };
}

// Export the validated environment configuration
export const env = getEnv();

// Export individual values for convenience
export const {
  googleScriptUrl,
  contactPhone,
  contactWhatsapp,
  contactEmail,
  appEnv,
} = env;

// Type guard for development mode
export const isDevelopment = () => appEnv === 'development';

// Type guard for production mode
export const isProduction = () => appEnv === 'production';


