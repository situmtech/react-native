import { requireNativeComponent } from 'react-native';
import type { ViewStyle } from 'react-native';

type Props = {
  style?: ViewStyle;
};

export const WebView = requireNativeComponent<Props>('WebView');