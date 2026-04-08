export const PERMS = {
  // User Management
  CREATE_USER: 1n << 0n,
  DELETE_USER: 1n << 1n,
  EDIT_USER: 1n << 2n,
  GET_USER: 1n << 3n,

  // Role Management
  CREATE_ROLE: 1n << 4n,
  DELETE_ROLE: 1n << 5n,
  EDIT_ROLE: 1n << 6n,
  GET_ROLE: 1n << 7n,

  // Permission Management
  CREATE_PERMISSION: 1n << 8n,
  DELETE_PERMISSION: 1n << 9n,
  EDIT_PERMISSION: 1n << 10n,
  GET_PERMISSION: 1n << 11n,

  // System
  MANAGE_CACHE: 1n << 12n,
  GET_ALL_LOGS: 1n << 13n,
  GET_HTTP_LOG: 1n << 14n,
  CREATE_MODULE: 1n << 15n,

  // Storage
  UPLOAD_FILE: 1n << 16n,
  GET_FILE: 1n << 17n,
  DELETE_FILE: 1n << 18n,
  SHARE_FILE: 1n << 19n,
  MANAGE_STORAGE: 1n << 20n,

  // Settings
  GET_SETTING: 1n << 21n,
  EDIT_SETTING: 1n << 22n,

  // Audit and Profile
  GET_AUDIT_LOG: 1n << 23n,
  GET_AUTH_LOG: 1n << 24n,
  GET_OWN_LOGS: 1n << 25n,
  GET_PROFILE: 1n << 26n,

  // BlogPost Module
  GET_BLOGPOST: 1n << 27n,
  CREATE_BLOGPOST: 1n << 28n,
  UPDATE_BLOGPOST: 1n << 29n,
  DELETE_BLOGPOST: 1n << 30n,

  // Medicpedia Penyakit Module
  GET_MEDICPEDIAPENYAKIT: 1n << 31n,
  CREATE_MEDICPEDIAPENYAKIT: 1n << 32n,
  UPDATE_MEDICPEDIAPENYAKIT: 1n << 33n,
  DELETE_MEDICPEDIAPENYAKIT: 1n << 34n,

  // Medicpedia Nutrisi Module
  GET_MEDICPEDIANUTRISI: 1n << 35n,
  CREATE_MEDICPEDIANUTRISI: 1n << 36n,
  UPDATE_MEDICPEDIANUTRISI: 1n << 37n,
  DELETE_MEDICPEDIANUTRISI: 1n << 38n,

  // Faq Module
  GET_FAQ: 1n << 39n,
  CREATE_FAQ: 1n << 40n,
  UPDATE_FAQ: 1n << 41n,
  DELETE_FAQ: 1n << 42n,

  // API Key Module
  GET_API_KEY: 1n << 43n,
  CREATE_API_KEY: 1n << 44n,
  DELETE_API_KEY: 1n << 45n,
};
