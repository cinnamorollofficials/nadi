export const PERMS = {
  // 1-4: User
  USER_VIEW: 1n << 0n,
  USER_CREATE: 1n << 1n,
  USER_EDIT: 1n << 2n,
  USER_DELETE: 1n << 3n,

  // 5-8: Role
  ROLE_VIEW: 1n << 4n,
  ROLE_CREATE: 1n << 5n,
  ROLE_EDIT: 1n << 6n,
  ROLE_DELETE: 1n << 7n,

  // 9-12: Permission
  PERMISSION_VIEW: 1n << 8n,
  PERMISSION_CREATE: 1n << 9n,
  PERMISSION_EDIT: 1n << 10n,
  PERMISSION_DELETE: 1n << 11n,

  // 13-15: API Key
  APIKEY_VIEW: 1n << 12n,
  APIKEY_CREATE: 1n << 13n,
  APIKEY_DELETE: 1n << 14n,

  // 16-19: Blogpost
  BLOGPOST_VIEW: 1n << 15n,
  BLOGPOST_CREATE: 1n << 16n,
  BLOGPOST_EDIT: 1n << 17n,
  BLOGPOST_DELETE: 1n << 18n,

  // 20-23: Penyakit
  PENYAKIT_VIEW: 1n << 19n,
  PENYAKIT_CREATE: 1n << 20n,
  PENYAKIT_EDIT: 1n << 21n,
  PENYAKIT_DELETE: 1n << 22n,

  // 24-27: Nutrisi
  NUTRISI_VIEW: 1n << 23n,
  NUTRISI_CREATE: 1n << 24n,
  NUTRISI_EDIT: 1n << 25n,
  NUTRISI_DELETE: 1n << 26n,

  // 28-31: FAQ
  FAQ_VIEW: 1n << 27n,
  FAQ_CREATE: 1n << 28n,
  FAQ_EDIT: 1n << 29n,
  FAQ_DELETE: 1n << 30n,

  // 32-36: Storage
  STORAGE_VIEW: 1n << 31n,
  STORAGE_UPLOAD: 1n << 32n,
  STORAGE_DELETE: 1n << 33n,
  STORAGE_SHARE: 1n << 34n,
  STORAGE_MANAGE: 1n << 35n,

  // 37-48: Settings
  SETTING_VIEW_WEBSITE: 1n << 36n,
  SETTING_EDIT_WEBSITE: 1n << 37n,
  SETTING_VIEW_SMTP: 1n << 38n,
  SETTING_EDIT_SMTP: 1n << 39n,
  SETTING_VIEW_STORAGE: 1n << 40n,
  SETTING_EDIT_STORAGE: 1n << 41n,
  SETTING_VIEW_SECURITY: 1n << 42n,
  SETTING_EDIT_SECURITY: 1n << 43n,
  SETTING_VIEW_INFRA: 1n << 44n,
  SETTING_EDIT_INFRA: 1n << 45n,
  SETTING_VIEW_ADVANCE: 1n << 46n,
  SETTING_EDIT_ADVANCE: 1n << 47n,

  // 49-52: Services
  SERVICE_VIEW_REDIS: 1n << 48n,
  SERVICE_MANAGE_REDIS: 1n << 49n,
  SERVICE_VIEW_KAFKA: 1n << 50n,
  SERVICE_MANAGE_KAFKA: 1n << 51n,

  // 53-55: Logs
  LOG_AUDIT: 1n << 52n,
  LOG_HTTP: 1n << 53n,
  LOG_SYSTEM: 1n << 54n,

  // 56-60: System
  SYSTEM_STAT: 1n << 55n,
  SYSTEM_GEN: 1n << 56n,
  SYSTEM_EXPORT: 1n << 57n,
  SYSTEM_PROFILE: 1n << 58n,
  // 61-64: AI Tier
  AITIER_VIEW: 1n << 60n,
  AITIER_CREATE: 1n << 61n,
  AITIER_EDIT: 1n << 62n,
  AITIER_DELETE: 1n << 63n,
  ANY: 1n << 59n,
};
