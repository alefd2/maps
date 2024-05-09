import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: " 100%",
  },
  switchContainer: {
    backgroundColor: "#ffffffba",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: "-40%",
    zIndex: 9999,
    margin: "auto",
  },
  switchLabel: {
    zIndex: 9999,
  },
});
