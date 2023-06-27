import WebView from 'react-native-webview';

export const sendMessageToViewer = (viewer: WebView, message: string) => {
  viewer.injectJavaScript(`window.postMessage(${message})`);
};
