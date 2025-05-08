import { StyleSheet } from "react-native";

export const Colors = {
  primary: "#283380",
  black: "#000",
  white: "#fff",
  red: "#b00020",
};

export const SharedStyles = StyleSheet.create({
  card: {
    borderRadius: 8,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: -24,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 8,
    gap: 8,
  },
  button: {
    marginHorizontal: 0,
  },
});
