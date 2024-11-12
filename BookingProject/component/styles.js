import { StyleSheet, Dimensions } from "react-native";

// Lấy kích thước màn hình để căn chỉnh hình nền
const { width, height } = Dimensions.get("window");
const COLORS = { primary: "#007260", white: "#fff" };

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

export default styles;
