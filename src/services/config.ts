export const REPO_SIZE = 10;
export const MAX_REPO_SIZE = 1000; // github API limiation
export const KEYWORD_DEBOUNCED_TIME = 500;

// For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.
export const RATE_LIMIT_LIMIT = 10;
export const RATE_LIMIT_DURATION = 60 * 1000;

export enum ResponseHeader {
  limit = 'x-ratelimit-limit',
  used = 'x-ratelimit-used',
  reset = 'x-ratelimit-reset',
}
