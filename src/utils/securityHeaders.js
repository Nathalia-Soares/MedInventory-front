/**
 * Security Headers Configuration
 * Configuração de headers de segurança para prevenir XSS e outros ataques
 *
 * Nota: Estes headers devem ser configurados no servidor web (nginx, Apache, etc)
 * ou no backend. Este arquivo documenta os headers recomendados.
 */

export const SECURITY_HEADERS = {
  // Previne XSS - bloqueia execução de scripts maliciosos
  "X-XSS-Protection": "1; mode=block",

  // Previne MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Previne clickjacking
  "X-Frame-Options": "DENY",

  // Política de Referrer
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Content Security Policy - previne XSS, injection attacks
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  // Permissions Policy (anteriormente Feature Policy)
  "Permissions-Policy": ["geolocation=()", "microphone=()", "camera=()"].join(
    ", "
  ),
};

/**
 * Documentação sobre cada header:
 *
 * X-XSS-Protection: Ativa proteção XSS do navegador
 * X-Content-Type-Options: Previne que navegador "adivinhe" o tipo de arquivo
 * X-Frame-Options: Previne que página seja carregada em iframe (clickjacking)
 * Referrer-Policy: Controla quanto de informação do referrer é enviado
 * Content-Security-Policy: Política de segurança mais importante - controla quais recursos podem ser carregados
 * Permissions-Policy: Controla quais APIs do navegador podem ser usadas
 */
