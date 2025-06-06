import React from "react";
import { Button, View, StyleSheet, ScrollView, Platform } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import { Colors, SharedStyles } from "../../SharedStyles";

const CardTitleIcon = () => <Icon source="cloud-download-outline" size={20} />;

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
        left={CardTitleIcon}
        titleStyle={SharedStyles.title}
      />
      <Card.Content>
        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button
              onPress={onFetchBuildingInfo}
              title="Fetch Building Info"
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button
              onPress={onFetchPois}
              title="Fetch POIs"
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button
              onPress={onFetchPoiCategories}
              title="Fetch POI Categories"
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button
              onPress={onFetchGeofences}
              title="Fetch Geofences"
              color={Colors.primary}
            />
          </View>
          <View style={SharedStyles.button}>
            <Button
              onPress={onInvalidateCache}
              title="Invalidate Cache"
              color={Colors.red}
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Output:</Text>
        <ScrollView horizontal>
          <Text style={styles.logText}>
            {output.length > 5000
              ? `${output.substring(0, 5000)}\n...[TRUNCATED, SEE LOGS]`
              : output}
          </Text>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.primary,
  },
  logText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    fontSize: 12,
    color: "#000",
  },
});
