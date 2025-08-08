import {WebView} from "../../webview/WebView";

export const sendMessageToViewer = (viewer: any | null, message: string) => {
  if (!viewer) return;
  // TODO: engadir método.
  // viewer.injectJavaScript(`window.postMessage(${message})`);
};
