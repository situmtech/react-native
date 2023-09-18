import { logError } from "..";
import type { Error } from "./types";

type PromiseResolve<T> = (response: T) => void;
type PromiseReject = (error?: Error) => void;

/**
 * Handles callbacks coming from SDKs asynchronously
 *
 * @param response
 * @param resolve
 * @param reject
 * @param errorMessage
 */

export const handleAsyncCallback = (
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
 * Handles callbacks coming from SDKs synchronously
 *
 * @param response
 * @param errorMessage
 */

export const handleSyncCallback = (
  r: { success: boolean },
  errorMessage: string
) => {
  if (r?.success) {
    return;
  } else {
    throw {
      code: -1,
      message: errorMessage || "Unknown error.",
    };
  }
};

/**
 * Wraps all SDK API methods with a exception handling code, and defines helper functions.
 *
 * @param fn
 * @returns
 */
export const exceptionWrapper = <T>(
  fn: ({
    onCallback,
  }: {
    onCallback: (r: { success: boolean }, errorMessage: string) => void;
    onSuccess: PromiseResolve<T>;
    onError: PromiseReject;
  }) => void
): T => {
  let returnValue: T;
  try {
    fn({
      onCallback: handleSyncCallback,
      onSuccess: (response) => {
        returnValue = response;
      },
      onError: (error) => {
        logError(error);
        throw error;
      },
    });
  } catch (error) {
    logError(error);
    throw error;
  }
  return returnValue;
};

/**
 * Wraps all SDK API methods with a promise, and defines helper functions.
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
    try {
      return fn({
        resolve,
        reject,
        onCallback: (r: { success: boolean }, errorMessage: string) =>
          handleAsyncCallback(r, resolve as () => void, reject, errorMessage),
        onSuccess: (response) => resolve(response),
        onError: (error) => {
          logError(error);
          reject(error);
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
