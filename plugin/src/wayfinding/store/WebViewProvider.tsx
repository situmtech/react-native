import React, { createContext, useContext, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type WebViewContextType = {
  mountWebView: (webView: React.ReactNode, webViewStyle: ViewStyle) => void;
  unmountWebView: () => void;
  isMounted: boolean;
};

// Type-safe default value
const defaultWebViewContext: WebViewContextType = {
  mountWebView: () => {
    if (__DEV__) {
      console.warn("WebViewPortal used without Provider");
    }
  },
  unmountWebView: () => {
    if (__DEV__) {
      console.warn("WebViewPortal used without Provider");
    }
  },
  isMounted: false,
};

const WebViewContext = createContext<WebViewContextType>(defaultWebViewContext);

export const WebViewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [webView, setWebView] = useState<React.ReactNode>(null);
  const [style, setStyle] = useState<ViewStyle>({});
  const [isMounted, setIsMounted] = useState(false);

  const mountWebView = (
    webViewComponent: React.ReactNode,
    webViewStyle: ViewStyle,
  ) => {
    setWebView(webViewComponent);
    setStyle(webViewStyle);
    setIsMounted(true);
  };

  const unmountWebView = () => {
    setIsMounted(false);
  };

  return (
    <WebViewContext.Provider
      value={{ mountWebView, unmountWebView, isMounted }}
    >
      {children}
      <View
        style={[style, isMounted ? styles.visible : styles.hidden]}
        collapsable={false}
        pointerEvents="box-none"
      >
        {webView}
      </View>
    </WebViewContext.Provider>
  );
};

const styles = StyleSheet.create({
  visible: {
    display: "flex",
  },
  hidden: {
    display: "none",
  },
});

export const useWebViewPortal = () => useContext(WebViewContext);
