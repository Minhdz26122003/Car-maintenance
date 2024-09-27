import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useWindowDimensions } from "react-native";

// Danh sách hình ảnh giới thiệu
const carouselItems = [
  {
    id: "1",
    title: "Chào mừng đến với Gara Ô Tô ABC",
    uri: "https://example.com/image1.jpg", // Thay bằng URL hình ảnh thực tế của bạn
  },
  {
    id: "2",
    title: "Dịch vụ sửa chữa chuyên nghiệp",
    uri: "https://example.com/image2.jpg", // Thay bằng URL hình ảnh thực tế của bạn
  },
  {
    id: "3",
    title: "Đặt lịch sửa xe dễ dàng",
    uri: "https://example.com/image3.jpg", // Thay bằng URL hình ảnh thực tế của bạn
  },
];

const WelcomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        autoplay
        loop
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ScheduleScreen")} // Đảm bảo route này tồn tại
        >
          <Text style={styles.buttonText}>Đặt Lịch Ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Alert.alert(
              "Thông tin",
              "Chúng tôi cung cấp dịch vụ sửa chữa và bảo trì ô tô chuyên nghiệp."
            )
          }
        >
          <Text style={styles.buttonText}>Tìm Hiểu Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: width,
    height: height * 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default WelcomeScreen;
