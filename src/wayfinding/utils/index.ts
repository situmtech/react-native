import WebView from "react-native-webview";

export const sendMessageToViewer = (viewer: WebView, message: string) => {
  if (message.indexOf("STOPPED") > 0) {
    console.log("sending message", message);
  }
  viewer.injectJavaScript(`window.postMessage(${message})`);
};
