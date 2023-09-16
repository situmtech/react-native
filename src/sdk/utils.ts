import { logError } from "..";
import type { Error } from "./types";

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
  errorMessage: string
) => {
  if (response?.success) {
    Promise.resolve();
  } else {
    Promise.reject({
      code: -1,
      message: errorMessage || "Unknown error.",
    });
  }
};

export const onSuccess = <T>(response: T) => {
  return Promise.resolve(response);
};

export const onError = (error: Error) => {
  logError(error);
  Promise.reject(error);
};

/**
 * Helper for the exceptionMiddleware. Allows to maintain the original function typings.
 *
 * @param fn
 * @returns
 */

export const exceptionMiddlewareWrap = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): ((...args: Args) => Promise<T>) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      return Promise.reject({
        code: error.code || -1,
        message: error.message || "Unknown error.",
      });
    }
  };
};

/**
 * Wraps promises on try catch to handle errors more easily.
 *
 * @param fn
 * @returns
 */

export const exceptionMiddleware = () => {
  return <Args extends any[], T>(fn: (...args: Args) => Promise<T>) => {
    return exceptionMiddlewareWrap<T, Args>(fn);
  };
};
