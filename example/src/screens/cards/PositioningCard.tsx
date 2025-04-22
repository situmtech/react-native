import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
import { Colors, SharedStyles } from '../../SharedStyles';
import { Location, LocationStatus } from '@situm/react-native';

interface PositioningCardProps {
    onStartPositioning: () => void;
    onStopPositioning: () => void;
    location: Location | undefined;
    status: LocationStatus | undefined;
    error: string;
  }
  
  export const PositioningCard: React.FC<PositioningCardProps> = ({ 
    onStartPositioning, 
    onStopPositioning,
    location,
    status,
    error,
  }) => {

    const locText = location ? [
      `Lat: ${location.position?.coordinate?.latitude}`,
      `Lng: ${location.position?.coordinate?.longitude}`,
      `Building: ${location.position?.buildingIdentifier}`,
      `Floor: ${location.position?.floorIdentifier}`,
      `T: ${location.timestamp}`
      ].join('\n') : 'No data';
    const statusText = status ? status.statusName : 'No data';

  return (
    <Card style={SharedStyles.card}>
      <Card.Title
        title="Positioning"
        left={() => <Icon source="crosshairs-gps" size={20} />}
        titleStyle={SharedStyles.title}
      />
      <Card.Content>
        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onStartPositioning} 
              title="Start positioning" 
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={onStopPositioning} 
              title="Stop positioning" 
              color={Colors.red}
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Location:</Text>
        <Text style={styles.logText}>{locText}</Text>
        
        <Text style={styles.sectionTitle}>Status:</Text>
        <Text style={styles.logText}>{statusText}</Text>
        
        <Text style={styles.sectionTitle}>Error:</Text>
        <Text style={styles.logText}>{error || 'No data'}</Text>
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

