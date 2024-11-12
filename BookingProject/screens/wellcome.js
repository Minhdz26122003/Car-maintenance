import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");
const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Giá trị cho hiệu ứng fade

  useEffect(() => {
    // Bắt đầu hiệu ứng fade-in
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade tới 1 (hiển thị)
      duration: 1500, // Thời gian thực hiện (ms)
      useNativeDriver: true,
    }).start();

    // Chuyển sang màn hình Login sau 2.5 giây
    const timer = setTimeout(() => {
      navigation.replace("LoginScreen");
    }, 2000);

    // Clear timeout nếu màn hình bị unmounted
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/car5.jpg")} style={styles.background} />
      <LottieView
        source={require("../assets/car5.jpg")} // Thay bằng đường dẫn Lottie của bạn
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.welcomeText}>
          Chào mừng đến với ứng dụng của chúng tôi!
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4c669f", // Gradient background
  },
  background: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    zIndex: -1,
    opacity: 0.8,
    marginTop: 10,
  },
  lottie: {
    width: 300,
    height: 300,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000", // Màu chữ trắng
    textAlign: "center",
    marginBottom: 20,
    zIndex: 9,
  },
});

export default WelcomeScreen;
