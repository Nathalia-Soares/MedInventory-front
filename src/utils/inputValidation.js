/**
 * Input Validation Utilities
 * Mecanismos de prevenção de XSS e SQL Injection
 */

/**
 * Sanitiza string removendo caracteres perigosos para XSS
 * Remove tags HTML e caracteres especiais perigosos
 */
export const sanitizeString = (input) => {
  if (!input || typeof input !== "string") return "";

  // Remove tags HTML
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Escapa caracteres especiais HTML
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized.trim();
};

/**
 * Valida email com regex seguro
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  // Regex simples e segura para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida username - apenas alfanuméricos, hífen e underscore
 * Previne XSS e SQL Injection patterns
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== "string") return false;

  // Apenas alfanuméricos, hífen e underscore, 3-20 caracteres
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username.trim());
};

/**
 * Valida ID numérico - previne SQL Injection
 */
export const validateNumericId = (id) => {
  if (id === null || id === undefined) return false;

  // Converte para número e verifica se é inteiro positivo
  const numId = Number(id);
  return Number.isInteger(numId) && numId > 0;
};

/**
 * Valida string de navegação (sectionId, route, etc)
 * Previne XSS através de manipulação de DOM
 */
export const validateNavigationString = (str) => {
  if (!str || typeof str !== "string") return false;

  // Apenas alfanuméricos e hífen (mesma validação do Navbar)
  const navRegex = /^[a-zA-Z0-9-]+$/;
  return navRegex.test(str);
};

/**
 * Remove caracteres perigosos para SQL Injection
 * (Validação adicional no frontend - backend deve usar prepared statements)
 */
export const sanitizeForSQL = (input) => {
  if (!input || typeof input !== "string") return "";

  // Remove caracteres perigosos comuns em SQL Injection
  const dangerousChars = [
    "'",
    '"',
    ";",
    "--",
    "/*",
    "*/",
    "xp_",
    "sp_",
    "exec",
    "execute",
    "union",
    "select",
    "insert",
    "update",
    "delete",
    "drop",
    "create",
    "alter",
  ];

  let sanitized = input.toLowerCase();
  dangerousChars.forEach((char) => {
    sanitized = sanitized.replace(new RegExp(char, "gi"), "");
  });

  return sanitized.trim();
};

/**
 * Valida e sanitiza objeto de dados de formulário
 */
export const sanitizeFormData = (formData) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Valida comprimento máximo de string (prevenção de DoS)
 */
export const validateMaxLength = (input, maxLength = 255) => {
  if (!input || typeof input !== "string") return false;
  return input.length <= maxLength;
};
