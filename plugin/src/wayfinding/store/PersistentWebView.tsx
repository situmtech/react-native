import { useCallback, useMemo } from "react";
import { ViewStyle } from "react-native";

import { useWebViewPortal } from "./WebViewProvider";

type PersistentWebViewType = {
  webViewComponent: React.ReactNode;
  style: ViewStyle;
};

export const PersistentWebView = (params: PersistentWebViewType) => {
  const { mountWebView, unmountWebView } = useWebViewPortal();

  const webViewMemo = useMemo(
    () => params.webViewComponent,
    [params.webViewComponent],
  );

  const showPersistentWebView = useCallback(() => {
    mountWebView(webViewMemo, params.style);
  }, [webViewMemo]);

  const hidePersistentWebView = useCallback(() => {
    unmountWebView();
  }, []);

  return { showPersistentWebView, hidePersistentWebView, webViewMemo };
};
