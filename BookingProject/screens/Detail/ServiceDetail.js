import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const ServiceDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Hình ảnh dịch vụ */}
        <Image source={{ uri: item.hinhanh }} style={styles.serviceImage} />

        {/* Header - Thông tin tổng quan */}
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Ionicons name="people-outline" size={24} color="#2ecc71" />
            <Text style={styles.headerItemText}>7,500+</Text>
            <Text style={styles.headerSubText}>Patients</Text>
          </View>
          <View style={styles.headerItem}>
            <Ionicons name="briefcase-outline" size={24} color="#3498db" />
            <Text style={styles.headerItemText}>10+</Text>
            <Text style={styles.headerSubText}>Years Exp.</Text>
          </View>
          <View style={styles.headerItem}>
            <FontAwesome name="star-o" size={24} color="#f39c12" />
            <Text style={styles.headerItemText}>4.9+</Text>
            <Text style={styles.headerSubText}>Rating</Text>
          </View>
          <View style={styles.headerItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#e74c3c"
            />
            <Text style={styles.headerItemText}>4,956</Text>
            <Text style={styles.headerSubText}>Reviews</Text>
          </View>
        </View>

        {/* Phần About (Mô tả dịch vụ) */}
        <View>
          <View style={styles.headerText}>
            <Text style={styles.tittle}>Dịch vụ :</Text>
            <Text style={styles.about}>{item.tendichvu}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.tittle}>Mô tả :</Text>
            <Text style={styles.about}>{item.mota}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.tittle}>Giá tiền :</Text>
            <Text style={styles.about}>{item.gia}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.tittle}>Thời gian làm :</Text>
            <Text style={styles.about}>{item.thoigianth}</Text>
            <Text style={styles.about}>giờ</Text>
          </View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.buttonDL}
              onPress={() => navigation.navigate("Booking", { item })}
            >
              <Text>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Thời gian làm việc */}
        <Text style={styles.sectionTitle}>Thời gian làm việc</Text>
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
            <Text style={styles.dayText}>Chủ nhật :</Text>
            <Text style={styles.timeText}>09:00 - 14:00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 20,
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubText: {
    fontSize: 10,
    color: "#666",
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  about: {
    paddingTop: 3,
    fontSize: 12,
    color: "#666",
  },
  tittle: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonDL: {
    fontWeight: "bold",
    backgroundColor: "#ffd700",
    borderRadius: 10,
    width: 150,
    alignItems: "center",
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",

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

export default ServiceDetailScreen;
