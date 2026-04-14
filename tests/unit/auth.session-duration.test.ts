import { describe, expect, it } from "vitest";

import {
  SESSION_MAX_AGE_SECONDS_DEFAULT,
  SESSION_MAX_AGE_SECONDS_REMEMBER_ME,
  getSessionMaxAgeSeconds,
} from "@/app/lib/auth/session-duration";

describe("session duration policy", () => {
  it("uses default max-age when rememberMe is false", () => {
    expect(getSessionMaxAgeSeconds({ rememberMe: false })).toBe(
      SESSION_MAX_AGE_SECONDS_DEFAULT,
    );
    expect(SESSION_MAX_AGE_SECONDS_DEFAULT).toBe(60 * 60 * 24 * 30);
  });

  it("uses extended max-age when rememberMe is true", () => {
    expect(getSessionMaxAgeSeconds({ rememberMe: true })).toBe(
      SESSION_MAX_AGE_SECONDS_REMEMBER_ME,
    );
    expect(SESSION_MAX_AGE_SECONDS_REMEMBER_ME).toBe(60 * 60 * 24 * 90);
  });
});
