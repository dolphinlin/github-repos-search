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

export function throttleAPI<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  calls: number,
  ms: number,
) {
  let startTime = Date.now(); // timer
  let isRunning = false;

  const queue: QueueItem[] = [];
  const completeArr: any[] = [];

  const runTask = () => {
    const task = queue.shift();
    if (!task) return;

    const { params, complete } = task;

    isRunning = true;
    fn(...params).then(result => {
      complete(result);
      completeArr.push({
        task,
        result,
        time: Date.now(),
      });
      console.log('complete', task, result);

      isRunning = false;
      if (queue.length > 0) processQueue(); // continue to excute next
    });
  };

  const processQueue = () => {
    if (isRunning) return;

    if (Date.now() - startTime < ms) {
      if (completeArr.length < calls) {
        runTask();
      } else {
        const waitFor = ms - (Date.now() - startTime) + 10; // 10ms is buffer time
        console.log('wait for:', waitFor);
        window.setTimeout(() => {
          runTask();
        }, waitFor);
      }
    } else {
      // refresh time
      startTime = Date.now();
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
