import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Linking,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import url from "../../ipconfig";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CenterDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [iduser, setIduser] = useState("");
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
      }
    };
    loadUserData();
  }, []);

  // Lấy thông tin người dùng
  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };

  // Gọi API để lấy danh sách dịch vụ
  const fetchServicesByCenter = async () => {
    try {
      const response = await fetch(
        `${url}/myapi/getDVforCT.php?idtrungtam=${item.idtrungtam}`
      );
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  // Gọi API để lấy danh sách bình luận
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/myapi/Danhgia/getdanhgia.php?idtrungtam=${item.idtrungtam}`
      );
      const data = await response.json();

      if (data.ratings && Array.isArray(data.ratings)) {
        setReviews(data.ratings);
      } else {
        console.log("Dữ liệu bình luận không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi tải đánh giá:", error);
    }
    setLoading(false);
  };

  // Hàm thêm bình luận
  const handleAddReview = async () => {
    if (!newReview.trim()) {
      Alert.alert("Thông báo", "Phải nhập nội dung bình luận.");
      return;
    }

    if (!rating || rating <= 0) {
      Alert.alert("Thông báo", "Phải đánh giá sao trước khi gửi.");
      return;
    }

    try {
      const response = await fetch(`${url}/myapi/Danhgia/themdanhgia.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idtrungtam: item.idtrungtam,
          iduser: iduser,
          noidung: newReview,
          danhgia: rating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
        setNewReview("");
        setRating(0);
      } else {
        console.log("Lỗi khi thêm bình luận:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  useEffect(() => {
    fetchServicesByCenter();
    fetchReviews();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: item.hinhanh }} style={styles.garageImage} />
        <Text style={styles.garageTitle}>{item.tentrungtam}</Text>

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

        <View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Địa chỉ: </Text>
            <Text style={styles.garageText}>{item.diachi}</Text>
          </View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Email: </Text>
            <Text style={styles.garageText}>{item.email}</Text>
          </View>
          <View style={styles.garageInfoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.headerItemText}> Số điện thoại: </Text>
            <Text style={styles.garageText}>{item.sodienthoai}</Text>
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
                onPress={() =>
                  navigation.navigate("ServiceDetailScreen", { item })
                }
              >
                <Image
                  source={{ uri: item.hinhanh }}
                  style={styles.serviceImage}
                />
                <View style={styles.serviceInfo}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.serviceName}
                  >
                    {item.tendichvu}
                  </Text>
                  {item.gia && (
                    <Text style={styles.servicePrice}>
                      Giá: {formatPrice(item.gia)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={true}
            pagingEnabled={true} // Bật hiệu ứng cuộn từng phần tử (snap từng trang)
            snapToAlignment="center" // Căn chỉnh phần tử tại vị trí giữa màn hình
            snapToInterval={300} // Khoảng cách giữa các snap points (chiều rộng từng item)
            decelerationRate="fast" // Cuộn mượt hơn (ngừng nhanh hơn khi không vuốt mạnh)
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
            latitude: parseFloat(item.toadox),
            longitude: parseFloat(item.toadoy),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(item.toadox),
              longitude: parseFloat(item.toadoy),
            }}
            title={item.tentrungtam}
            description={item.diachi}
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${item.toadox},${item.toadoy}`;
              Linking.openURL(url); // Mở Google Maps với tọa độ
            }}
          />
        </MapView>

        {/* Phần bình luận */}
        <Text style={styles.serviceHeader}>Bình luận và Đánh giá</Text>
        <View style={styles.reviewsContainer}>
          {/* Hiển thị danh sách bình luận */}
          {reviews.length === 0 ? (
            <Text>Chưa có bình luận nào.</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.iddanhgia} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={require("../../asset/account.jpg")}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.reviewAuthor}>#{review.username}</Text>
                    <Text style={styles.reviewDate}>{review.ngaybinhluan}</Text>
                  </View>
                </View>
                <Text style={styles.reviewContent}>{review.noidung}</Text>
                <Text style={styles.reviewRating}>
                  Đánh giá: {review.danhgia} sao
                </Text>
              </View>
            ))
          )}

          <View style={styles.fromcm}>
            {/* Form thêm bình luận */}
            <TextInput
              style={styles.input}
              placeholder="Thêm bình luận..."
              value={newReview}
              onChangeText={setNewReview}
              multiline
            />
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={24}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleAddReview}
              style={styles.addReviewButton}
            >
              <Text style={styles.addReviewText}>Gửi bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
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
  serviceHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  serviceCard: {
    flexDirection: "row",
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    width: 200,
  },
  servicePrice: {
    fontSize: 14,
    color: "#007BFF",
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  dayText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "right",
    flex: 1,
  },
  fromcm: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  reviewsContainer: {
    paddingHorizontal: 10,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
  },
  reviewContent: {
    fontSize: 14,
    marginVertical: 5,
    color: "#333",
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  starButton: {
    marginHorizontal: 5,
  },
  addReviewButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addReviewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CenterDetailScreen;
