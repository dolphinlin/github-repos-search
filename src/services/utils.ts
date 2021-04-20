export const sleep = (ms: number) =>
  new Promise(resolve => {
    window.setTimeout(() => {
      return resolve(true);
    }, ms);
  });

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  debounceTime: number,
) {
  let timer = -1;

  return (...params: Parameters<T>) => {
    if (timer !== -1) window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      fn(...params);
    }, debounceTime);
  };
}
