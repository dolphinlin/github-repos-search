import { AxiosResponse } from 'axios';

import { RATE_LIMIT_BUFFER } from './config';

export const ms2s = (ms: number) => Math.floor(ms / 1000);

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

interface QueueItem {
  params: any[];
  complete: (value: any) => void;
}

export interface RateLimitMeta {
  limit: number;
  used: number;
  resetTime: number;
}
/**
 * @description the throttle wrapper can be used to restrict API in specific frequencies at specific time
 * @param fn wrapped API call
 * @param getter rate-limit metadata getter
 * @returns API call with times-throttle
 */
export function throttleAPI<
  R extends AxiosResponse<any>,
  T extends (...args: any[]) => Promise<R>
>(fn: T, getter: (result: R) => RateLimitMeta) {
  let rateLimitCount = 10; // default
  let rateLimitUsed = 0;
  let rateLimitRemain = rateLimitCount - rateLimitUsed;
  let rateLimitResetTime = ms2s(Date.now());

  // let startTime = Date.now(); // timer
  let isRunning = false;

  const queue: QueueItem[] = [];
  const completeArr: any[] = [];

  const runTask = () => {
    const task = queue.shift();
    if (!task) return;

    const { params, complete } = task;

    fn(...params).then(result => {
      complete(result);
      completeArr.push({
        task,
        result,
        time: Date.now(),
      });
      console.log('complete', task, result);

      const meta = getter(result);
      console.log('update meta:', meta);
      rateLimitCount = meta.limit;
      rateLimitUsed = meta.used;
      rateLimitRemain = meta.limit - meta.used;
      rateLimitResetTime = meta.resetTime;

      isRunning = false;
      if (queue.length > 0) processQueue(); // continue to excute next
    });
  };

  const processQueue = () => {
    if (isRunning) return;

    isRunning = true;
    const now = ms2s(Date.now());
    if (now < rateLimitResetTime) {
      // in current rate-limit period
      if (rateLimitRemain > 0) {
        // valid count of API call
        console.log('remain is enough:', rateLimitRemain);
        runTask();
      } else {
        // exceed rate-limit
        console.log('remain isnot enough');
        const waitFor = (rateLimitResetTime - now) * 1000 + RATE_LIMIT_BUFFER;
        console.log('wait for:', waitFor);
        window.setTimeout(() => {
          // delayed excute
          runTask();
        }, waitFor);
      }
    } else {
      console.log('reset time updated', now, rateLimitResetTime);
      completeArr.splice(0, completeArr.length); // claer complete array

      runTask();
    }
  };

  return (...params: Parameters<T>): Promise<ReturnType<T>> =>
    new Promise(resolve => {
      const task = {
        params,
        complete: resolve,
      };

      queue.push(task);
      processQueue();
    });
}
