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
    width: "100%",
  },
  actionWrapper: {
    // backgroundColor: "#ffffffba",
    height: "100%",
    width: "20%",
    position: "absolute",
    bottom: 0,
    right: 10,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  switchLabel: {
    zIndex: 9999,
  },
});
