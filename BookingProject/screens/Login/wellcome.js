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
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade tới 1 (hiển thị)
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("LoginScreen");
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/anims/LoadingCar.json")}
        autoPlay
        style={styles.lottie}
      />
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>
          Chào mừng đến với ứng dụng của chúng tôi!
        </Text>
        <Text style={styles.subtitle}>
          Khám phá một trải nghiệm tuyệt vời ngay bây giờ
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
    backgroundColor: "#4c669f",
  },

  lottie: {
    width: 400,
    height: 400,
    zIndex: -1,
    marginBottom: -50,
  },
  textContainer: {
    zIndex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff", // Màu chữ sáng
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    fontStyle: "italic", // Thêm kiểu chữ nghiêng cho subtitle
  },
});

export default WelcomeScreen;
