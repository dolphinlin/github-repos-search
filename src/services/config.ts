export const REPO_SIZE = 20; // count of repos in one time
export const KEYWORD_DEBOUNCED_TIME = 700;

// For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.
export const RATE_LIMIT_LIMIT = 10;
export const RATE_LIMIT_DURATION = 60 * 1000;
export const RATE_LIMIT_BUFFER = 100; // unit: ms

export enum ResponseHeader {
  limit = 'x-ratelimit-limit',
  used = 'x-ratelimit-used',
  reset = 'x-ratelimit-reset',
}
