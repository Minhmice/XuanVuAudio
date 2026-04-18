export const SESSION_MAX_AGE_SECONDS_DEFAULT = 60 * 60 * 24 * 30;
export const SESSION_MAX_AGE_SECONDS_REMEMBER_ME = 60 * 60 * 24 * 90;

export function getSessionMaxAgeSeconds(params: { rememberMe: boolean }): number {
  return params.rememberMe
    ? SESSION_MAX_AGE_SECONDS_REMEMBER_ME
    : SESSION_MAX_AGE_SECONDS_DEFAULT;
}
