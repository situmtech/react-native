import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {NavigationMap} from '../navigation';

import styles from './styles';

import {NativeModules} from 'react-native';

export const Home = (props: {componentId: string}) => {
  const onNavigateToHolidaysList = () => {
    var SitumPlugin = NativeModules.SitumPlugin;
    SitumPlugin.setApiKey('EMAIL', 'KEY');
  };

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {...NavigationMap.Home.options});
  }, [props.componentId]);

  return (
    <View style={styles.container}>
      <Button title="Start" onPress={onNavigateToHolidaysList} />
    </View>
  );
};
