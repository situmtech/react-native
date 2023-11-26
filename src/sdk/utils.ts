import { logError } from "..";
import { ErrorCode, ErrorType } from "./types";
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

export function locationErrorAdapter(error) {
  let adaptedCode = error.code;
  let adaptedMessage = error.message;
  let adaptedType = ErrorType.CRITICAL;

  switch (error.code.toString()) {
    case "8001": // MISSING_LOCATION_PERMISSION
    case "8": // kSITLocationErrorLocationDisabled
    case "9": // kSITLocationErrorLocationRestricted
    case "10": // kSITLocationErrorLocationAuthStatusNotDetermined
      adaptedCode = ErrorCode.LOCATION_PERMISSION_DENIED;
      break;
    case "8002": // LOCATION_DISABLED
      adaptedCode = ErrorCode.LOCATION_DISABLED;
      break;
    case "8012": // MISSING_BLUETOOTH_PERMISSION
      adaptedCode = ErrorCode.BLUETOOTH_PERMISSION_DENIED;
      break;
    case "6": // kSITLocationErrorBluetoothisOff
      adaptedCode = ErrorCode.BLUETOOTH_DISABLED;
      break;
    // Add more cases as needed
  }

  const returnError: Error = {
    code: adaptedCode,
    message: adaptedMessage,
    type: adaptedType,
  };

  return returnError;
}
