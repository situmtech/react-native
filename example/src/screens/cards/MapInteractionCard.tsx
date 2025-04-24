import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { Colors, SharedStyles } from '../../SharedStyles';
import SitumPlugin, { Building, Poi } from '@situm/react-native';
import { SITUM_BUILDING_ID } from '../../situm';
import { Picker } from '@react-native-picker/picker';

interface MapInteractionCardProps {
  onSelectPoi: (identifier: string) => void;
  onNavigateToPoi: (identifier: string) => void;
}

export const MapInteractionCard: React.FC<MapInteractionCardProps> = ({ 
  onSelectPoi, 
  onNavigateToPoi,
}) => {
  const [pois, setPois] = useState<Poi[]>([]);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);

  // Fetch POIs:
  useEffect(() => {
    SitumPlugin.fetchBuildings()
      .then((buildings: Building[]) => {
        const myBuilding = buildings.find(b => b.buildingIdentifier === SITUM_BUILDING_ID);
        if (!myBuilding) return null;
        return myBuilding;
      })
      .then(building => {
        if (building) {
          return SitumPlugin.fetchIndoorPOIsFromBuilding(building);
        }
        return [];
      })
      .then(setPois)
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Card style={SharedStyles.card}>
      <Card.Title
        title="Map Interaction"
        left={() => <Icon source="code-greater-than" size={20} />}
        titleStyle={SharedStyles.title}
      />
      <Card.Content>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPoiId}
            onValueChange={(itemValue) => setSelectedPoiId(itemValue)}
            style={styles.picker}
            dropdownIconColor={Colors.primary}
          >
            <Picker.Item label="Select a POI..." value={null} />
            {pois.map(poi => (
              <Picker.Item 
                key={poi.identifier} 
                label={`${poi.poiName} (floor ${poi.floorIdentifier})`} 
                value={poi.identifier} 
              />
            ))}
          </Picker>
        </View>

        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button 
              onPress={() => selectedPoiId && onSelectPoi(selectedPoiId)} 
              title="Select POI" 
              color={Colors.primary}
              disabled={!selectedPoiId}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button 
              onPress={() => selectedPoiId && onNavigateToPoi(selectedPoiId)} 
              title="Navigate to POI" 
              color={Colors.primary}
              disabled={!selectedPoiId}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: Colors.primary,
  },
});
