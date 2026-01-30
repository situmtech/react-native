import React, { useState } from "react";
import { Button, View, StyleSheet, Platform, TextInput } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import { Colors, SharedStyles } from "../../SharedStyles";

const CardTitleIcon = () => <Icon source="share-social-outline" size={20} />;

interface ShareLiveLocationCardProps {
  onSetShareLiveLocationSession: (identifier: string) => void;
}

export const ShareLiveLocationCard: React.FC<ShareLiveLocationCardProps> = ({
  onSetShareLiveLocationSession,
}) => {
  const [identifier, setIdentifier] = useState("");

  return (
    <Card style={SharedStyles.card}>
      <Card.Title
        title="Share Live Location"
        left={CardTitleIcon}
        titleStyle={SharedStyles.title}
      />

      <Card.Content>
        {/* Campo de texto */}
        <TextInput
          style={styles.input}
          placeholder="Enter session identifier"
          value={identifier}
          onChangeText={setIdentifier}
        />

        <View style={SharedStyles.buttonContainer}>
          <View style={SharedStyles.button}>
            <Button
              title="Set Share Session"
              color={Colors.primary}
              onPress={() => onSetShareLiveLocationSession(identifier)}
              disabled={!identifier} // opcional
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
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
