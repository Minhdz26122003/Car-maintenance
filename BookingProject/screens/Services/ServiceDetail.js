import React, { useState } from "react";
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
  const [rating, setRating] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expanded, setExpanded] = useState([]);

  const toggleExpand = (index) => {
    setExpanded((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };
  const benefits = [
    {
      title: "28+ kinh nghiệm :",
      detail:
        "Với hơn 28 năm hình thành và phát triển trong ngành lốp và sở hữu kho lốp lớn nhất Miền Bắc. Đáp ứng hầu hết lốp xe du lịch trên thị trường.",
    },
    {
      title: "Đội ngũ kTV chuyên môn cao:",
      detail:
        "“Chuyên nghiệp và tận tâm” là 2 đặc điểm nổi bật nhất khi nói về đội ngũ kỹ thuật viên. Các kỹ thuật viên của trung tâm đều có kinh nghiệm làm việc ở các hãng xe lớn.",
    },
    {
      title: "Hệ thống máy móc, trang thiết bị hàng đầu:",
      detail:
        "Hệ thống máy móc hiện đại, tiên tiến - hiện đại bậc nhất hiện nay.",
    },
    {
      title: "Phòng chờ chuẩn 5 sao:",
      detail:
        "Phòng chờ 5 sao đem tới trải nghiệm thoải mái, thư giãn khi chờ đợi xe được chăm sóc.",
    },
  ];
  return (
    <View style={{ paddingBottom: 40 }}>
      <ScrollView>
        <View style={styles.container}>
          {/* Hình ảnh dịch vụ */}
          <Image source={{ uri: item.hinhanh }} style={styles.serviceImage} />
          <Text style={styles.textname}>{item.tendichvu}</Text>

          {/* Tính năng đánh giá sao */}
          <View style={styles.starRatingContainer}>
            <Text style={styles.tittle}>Đánh giá:</Text>
            <View style={styles.starContainer}>
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
          </View>
          {/* Phần About (Mô tả dịch vụ) */}
          <View>
            <View style={styles.headerText}>
              <Text style={styles.tittle}>Mô tả:</Text>
              <Text style={styles.aboutmota}>
                {isExpanded ? item.mota : `${item.mota.slice(0, 50)}...`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.seeMore}>
                {isExpanded ? "Thu gọn <" : "Xem thêm >"}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.tittle}>Giá tiền :</Text>
              <Text style={styles.about}> {formatPrice(item.gia)}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.tittle}>Thời gian làm :</Text>
              <Text style={styles.about}>{item.thoigianth}</Text>
              <Text style={styles.about}>giờ</Text>
            </View>
          </View>
          {/* Thời gian làm việc */}
          <View>
            <Text style={styles.sectionTitle}>
              Tại sao chọn dịch vụ của chúng tôi?
            </Text>
            <View>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.advantageRow}>
                  <TouchableOpacity
                    style={styles.rowHeader}
                    onPress={() => toggleExpand(index)}
                  >
                    <Text style={styles.dayText}>{benefit.title}</Text>
                    <Ionicons
                      name={
                        expanded.includes(index) ? "chevron-up" : "chevron-down"
                      }
                      size={24}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {expanded.includes(index) && (
                    <Text style={styles.timeText}>{benefit.detail}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View></View>
        </View>
      </ScrollView>
      <View style={styles.conatinerBtn}>
        <TouchableOpacity
          style={styles.buttonDL}
          onPress={() => navigation.navigate("Booking", { item })}
        >
          <Text>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 65,
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
    fontSize: 13,
    color: "#2f4f4f",
    marginRight: 5,
  },
  aboutmota: {
    paddingTop: 3,
    fontSize: 12,
    color: "#2f4f4f",
    paddingRight: 50,
  },
  tittle: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  conatinerBtn: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  buttonDL: {
    fontWeight: "bold",
    backgroundColor: "#ffd700",
    width: 400,

    alignItems: "center",
    borderRadius: 20,
    padding: 15,
  },

  sectionTitle: {
    fontSize: 15,
    marginTop: 20,
    fontWeight: "bold",
  },
  textname: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },

  advantageRow: {
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "400",
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
    paddingLeft: 10,
  },
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  starButton: {
    marginHorizontal: 5,
  },
  seeMore: {
    color: "red",
    marginVertical: 8,

    fontSize: 12,
  },
});

export default ServiceDetailScreen;
