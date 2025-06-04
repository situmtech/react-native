import WebView from "react-native-webview";

export const sendMessageToViewer = (viewer: WebView | null, message: string) => {
  if (!viewer) return;
  viewer.injectJavaScript(`window.postMessage(${message})`);
};
