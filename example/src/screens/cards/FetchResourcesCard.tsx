import React from 'react';
import { Button, View, StyleSheet, ScrollView } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
import { Colors, SharedStyles } from '../../SharedStyles';

interface FetchResourcesCardProps {
    onFetchBuildingInfo: () => void;
    onFetchPois: () => void;
    onFetchPoiCategories: () => void;
    onFetchGeofences: () => void;
    onInvalidateCache: () => void;
    output: string;
  }
  
  export const FetchResourcesCard: React.FC<FetchResourcesCardProps> = ({ 
    onFetchBuildingInfo, 
    onFetchPois,
    onFetchPoiCategories,
    onFetchGeofences,
    onInvalidateCache,
    output,
  }) => {
  return (
    <Card style={SharedStyles.card}>
      <Card.Title
        title="Fetch Resources"
        left={() => <Icon source="cloud-download-outline" size={20} />}
        titleStyle={SharedStyles.title}
      />
      <Card.Content>
        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onFetchBuildingInfo} 
              title="fetch Building Info" 
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onFetchPois} 
              title="fetch Pois" 
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onFetchPoiCategories} 
              title="fetch Poi Categories" 
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onFetchGeofences} 
              title="fetch Geofences" 
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onInvalidateCache} 
              title="invalidate Cache" 
              color={Colors.red}
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Output:</Text>
        <ScrollView horizontal>
            <Text style={styles.logText}>{output}</Text>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    color: Colors.primary,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#000',
  },
});

