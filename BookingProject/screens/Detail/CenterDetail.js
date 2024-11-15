import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const CenterDetailScreen = ({ route, navigation }) => {
  const { center } = route.params; // Lấy dữ liệu trung tâm từ params
  const { reviews, setReviews } = useState([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  // Gọi API để lấy danh sách dịch vụ
  const fetchServicesByCenter = async () => {
    try {
      const response = await fetch(
        `${url}/myapi/getDVforCT.php?idtrungtam=${center.idtrungtam}`
      );
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // const fetchReviews = async () => {
  //   try {
  //     const response = await fetch("API_URL"); // URL API của bạn
  //     const data = await response.json();
  //     setReviews(data.reviews); // gán dữ liệu reviews từ API
  //     // setAverageRating(data.averageRating); // tính toán điểm trung bình từ API
  //     // setLoadingReviews(false);
  //   } catch (error) {
  //     console.error("Lỗi tải đánh giá:", error);
  //   }
  // };

  useEffect(() => {
    fetchServicesByCenter();
    // fetchReviews();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: center.hinhanh }} style={styles.garageImage} />
        <Text style={styles.garageTitle}>{center.tentrungtam}</Text>

        {/* Header - Thông tin tổng quan */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerItem}>
            <Ionicons name="call-outline" size={24} color="#2ecc71" />
            <Text style={styles.headerItemText}>Gọi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#3498db"
            />
            <Text style={styles.headerItemText}>Nhắn tin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerItem}>
            <Ionicons name="share-social-outline" size={24} color="#e74c3c" />

            <Text style={styles.headerItemText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin trung tâm */}
        <View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Địa chỉ: </Text>
            <Text style={styles.garageText}>{center.diachi}</Text>
          </View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Email: </Text>
            <Text style={styles.garageText}>{center.email}</Text>
          </View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Số điện thoại: </Text>
            <Text style={styles.garageText}>{center.sodienthoai}</Text>
          </View>
        </View>

        {/* Danh sách dịch vụ */}
        <Text style={styles.serviceHeader}>Danh sách dịch vụ</Text>
        {services.length === 0 ? (
          <Text>Không có dịch vụ nào.</Text>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.iddichvu.toString()}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceCard}
                key={item.iddichvu}
                onPress={() =>
                  navigation.navigate("ServiceDetailScreen", { item })
                }
              >
                <Image
                  source={{ uri: item.hinhanh }}
                  style={styles.serviceImage}
                />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.tendichvu}</Text>
                  {item.gia && (
                    <Text style={styles.servicePrice}>Giá: {item.gia} VND</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Thời gian làm việc */}
        <Text style={styles.sectionTitle}>Giờ làm việc</Text>
        <View style={styles.workingHours}>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 2:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 3:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 4:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 5:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 6:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Thứ 7:</Text>
            <Text style={styles.timeText}>09:00 - 22:00</Text>
          </View>
          <View style={styles.workingHoursRow}>
            <Text style={styles.dayText}>Chủ nhật:</Text>
            <Text style={styles.timeText}>09:00 - 14:00</Text>
          </View>
        </View>

        {/* Google Map */}
        <View>
          <Text style={styles.serviceHeader}>Vị Trí Trung Tâm</Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(center.toadox),
            longitude: parseFloat(center.toadoy),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(center.toadox),
              longitude: parseFloat(center.toadoy),
            }}
            title={center.tentrungtam}
            description={center.diachi}
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${center.toadox},${center.toadoy}`;
              Linking.openURL(url); // Mở Google Maps với tọa độ
            }}
          />
        </MapView>

        <View>
          <Text style={styles.serviceHeader}>Đánh Giá Trung Tâm</Text>
          {/* Hiển thị tổng số sao */}
          {/* <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={
                  index < Math.floor(averageRating) ? "star" : "star-outline"
                }
                size={20}
                color="gold"
              />
            ))}
            <Text style={styles.ratingText}>{averageRating}</Text>
          </View> */}

          {/* Hiển thị danh sách đánh giá */}
          {/* {loadingReviews ? (
            <Text>Đang tải đánh giá...</Text>
          ) : (
            <FlatList
              data={reviews} // dữ liệu từ API
              renderItem={({ item }) => (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                  <View style={styles.ratingRow}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Ionicons
                        key={index}
                        name={index < item.rating ? "star" : "star-outline"}
                        size={16}
                        color="gold"
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewText}>{item.comment}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )} */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  headerText: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  headerItem: {
    alignItems: "center",
  },
  headerItemText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },

  garageImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  garageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },

  garageInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  garageText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#666",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  serviceHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  serviceItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 5,
  },

  serviceDescription: {
    fontSize: 14,
    color: "#666",
  },
  serviceCard: {
    flexDirection: "row", // Hình ảnh bên trái, thông tin bên phải
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Tạo đổ bóng cho card
    alignItems: "center",
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15, // Khoảng cách giữa ảnh và phần thông tin
  },
  serviceInfo: {
    flex: 1, // Chiếm toàn bộ phần còn lại của thẻ
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },

  servicePrice: {
    fontSize: 14,
    color: "#007BFF", // Màu xanh để làm nổi bật giá
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  workingHours: {
    marginBottom: 20,
  },
  workingHoursRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Căn giữa các phần tử
    alignItems: "center",
    marginBottom: 5,
  },
  dayText: {
    fontSize: 16,
    color: "#666",
    flex: 1, // Chiếm không gian bên trái
  },
  timeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "right", // Căn phải cho thời gian
    flex: 1,
  },
});

export default CenterDetailScreen;
