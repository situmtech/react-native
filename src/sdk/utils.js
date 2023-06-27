/**
 * Small utility that can be used as an error handler. You cannot just pass
 * `console.error` as a failure callback - it's not properly bound.  If passes an
 * `Error` object, it will print the message and stack.
 */
const logError = __DEV__
  ? function (response) {
      if (response instanceof String) {
        console.log(response);
      } else {
        console.log(JSON.stringify(response));
      }
    }
  : function (response) {};

module.exports = {
  logError,
};
