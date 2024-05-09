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
    zIndex: 9999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  switchLabel: {
    zIndex: 9999,
  },
});
