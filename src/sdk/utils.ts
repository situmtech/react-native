import { logError } from "..";
import type { Error } from "./types";

type PromiseResolve<T> = (response: T) => void;
type PromiseReject = (error?: Error) => void;

/**
 * Handles callbacks coming from SDKs
 *
 * @param response
 * @param resolve
 * @param reject
 * @param errorMessage
 */

export const handleCallback = (
  response: { success: boolean },
  resolve: PromiseResolve<void>,
  reject: PromiseReject,
  errorMessage: string
) => {
  if (response?.success) {
    resolve();
  } else {
    reject({
      code: -1,
      message: errorMessage || "Unknown error.",
    });
  }
};

/**
 * Wraps all promises with general code.
 *
 * @param fn
 * @returns
 */
export const promiseWrapper = <T>(
  fn: ({
    resolve,
    reject,
    onCallback,
    onSuccess,
    onError,
  }: {
    resolve: PromiseResolve<T>;
    reject: PromiseReject;
    onCallback: (r: { success: boolean }, errorMessage: string) => void;
    onSuccess: PromiseResolve<T>;
    onError: PromiseReject;
  }) => void
) => {
  return new Promise<T>((resolve, reject) => {
    const onCallback = (r: { success: boolean }, errorMessage: string) =>
      handleCallback(r, resolve as () => void, reject, errorMessage);

    try {
      return fn({
        resolve,
        reject,
        onCallback,
        onSuccess: (response) => resolve(response),
        onError: (error) => {
          logError(error);
          return reject(error);
        },
      });
    } catch (error) {
      logError(error);
      reject({
        code: error?.code || -1,
        message: error?.message || "Unknown error.",
      });
    }
  });
};
