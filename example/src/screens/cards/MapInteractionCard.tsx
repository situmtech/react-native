import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { Card, Icon } from "react-native-paper";
import { Colors, SharedStyles } from "../../SharedStyles";
import SitumPlugin, { Building, Poi } from "@situm/react-native";
import { SITUM_BUILDING_ID } from "../../situm";

interface MapInteractionCardProps {
  onSelectPoi: (identifier: string) => void;
  onNavigateToPoi: (identifier: string) => void;
}

export const MapInteractionCard: React.FC<MapInteractionCardProps> = ({
  onSelectPoi,
  onNavigateToPoi,
}) => {
  const [pois, setPois] = useState<Poi[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch POIs:
  useEffect(() => {
    SitumPlugin.fetchBuildings()
      .then((buildings: Building[]) => {
        const myBuilding = buildings.find(
          (b) => b.buildingIdentifier === SITUM_BUILDING_ID
        );
        if (!myBuilding) return null;
        return myBuilding;
      })
      .then((building) => {
        if (building) {
          return SitumPlugin.fetchIndoorPOIsFromBuilding(building);
        }
        return [];
      })
      .then(setPois)
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handlePoiSelection = (poi: Poi) => {
    setSelectedPoi(poi);
    setModalVisible(false);
  };

  return (
    <Card style={SharedStyles.card}>
      <Card.Title
        title="Map Interaction"
        left={() => <Icon source="code-greater-than" size={20} />}
        titleStyle={SharedStyles.title}
      />
      <Card.Content>
        <View style={styles.selectorButtonContainer}>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectorButtonText}>
              {selectedPoi
                ? `${selectedPoi.poiName} (floor ${selectedPoi.floorIdentifier})`
                : "Select a POI..."}
            </Text>
            <Icon source="menu-down" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Modal dialog to select a POI */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select a POI</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon source="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={pois}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.poiItem}
                    onPress={() => handlePoiSelection(item)}
                  >
                    <Text style={styles.poiName}>{item.poiName}</Text>
                    <Text style={styles.poiFloor}>
                      Floor {item.floorIdentifier}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </View>
        </Modal>

        {/* Actions */}
        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button
              onPress={() => selectedPoi && onSelectPoi(selectedPoi.identifier)}
              title="Select POI"
              color={Colors.primary}
              disabled={!selectedPoi}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button
              onPress={() =>
                selectedPoi && onNavigateToPoi(selectedPoi.identifier)
              }
              title="Navigate to POI"
              color={Colors.primary}
              disabled={!selectedPoi}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  selectorButtonContainer: {
    marginBottom: 16,
  },
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
  },
  selectorButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  poiItem: {
    paddingVertical: 12,
  },
  poiName: {
    fontSize: 16,
    color: "black",
  },
  poiFloor: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});
