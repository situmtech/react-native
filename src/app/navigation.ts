import {Navigation} from 'react-native-navigation';
import {Home} from './Home';

export const NavigationMap = {
  Home: {
    name: 'Home',
    component: Home,
    options: {
      topBar: {
        title: {
          text: 'Home',
        },
      },
    },
  },
};

export function registerScreens() {
  for (const key in NavigationMap) {
    Navigation.registerComponent(key, () => NavigationMap[key].component);
  }
}
