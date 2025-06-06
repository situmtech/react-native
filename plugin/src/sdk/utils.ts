import { LocationStatusName, logError } from "..";
import type { Error } from "./types";
import { ErrorCode, ErrorType } from "./types";

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
  errorMessage: string,
) => {
  if (response?.success) {
    resolve();
  } else {
    reject({
      code: ErrorCode.UNKNOWN,
      message: errorMessage || "Unknown error.",
      type: ErrorType.NON_CRITICAL,
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
  errorMessage: string,
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
  }) => void,
) => {
  let returnValue: T | undefined;
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
  }) => void,
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
        code: ErrorCode.UNKNOWN,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? error?.message
            : "Unknown error.",
        type: ErrorType.NON_CRITICAL,
      });
    }
  });
};

export function locationStatusAdapter(statusName: any): string {
  // The MapView will only understand status names declared at LocationStatusName and CALCULATING
  // is not one of them.
  // TODO: implement status & error adapter on native SDKs.
  if (statusName === "CALCULATING") {
    statusName = LocationStatusName.STARTING;
  }
  return statusName;
}

export function locationErrorAdapter(error: any): Error {
  let adaptedCode = ErrorCode.UNKNOWN;
  const adaptedMessage = error.message;
  const adaptedType = ErrorType.CRITICAL;

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
    case "8100": //BLUETOOTH_DISABLED. 8100 ->This number does not exist in Situm SDK. We made it up in SitumMapper.java (RN adapter)
    case "6": // kSITLocationErrorBluetoothisOff
      adaptedCode = ErrorCode.BLUETOOTH_DISABLED;
      break;
    case "11": //kSITLocationErrorLocationAccuracyAuthorizationStatusReducedAccuracy
      adaptedCode = ErrorCode.REDUCED_ACCURACY;
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
