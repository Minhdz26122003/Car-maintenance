import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import url from "../../ipconfig";
import Carousel from "react-native-snap-carousel";

const { width: viewportWidth } = Dimensions.get("window");
const banners = [
  require("../../asset/Banner.jpg"),
  require("../../asset/Banner2.png"),
  require("../../asset/Banner3.jpg"),
  require("../../asset/Banner4.png"),
  require("../../asset/Banner5.jpg"),
];
const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [diachi, setDiachi] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [email, setEmail] = useState("");
  const [vaitro, setVaitro] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        const userData = await getUserData();
        if (userData) {
          setIduser(userData.iduser);
          // setUsername(userData.username);
          // setPassword(userData.password);
          // setDiachi(userData.diachi);
          // setSodienthoai(userData.sodienthoai);
          // setEmail(userData.email);
          // setVaitro(userData.vaitro);
          loadAccount(userData.iduser);
        }
      };

      loadUserData();
      fetchServices();
      fetchCenters();
    }, [])
  );
  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };

  const loadAccount = async (iduser) => {
    try {
      const response = await fetch(
        `${url}/myapi/Taikhoan/gettkbyid.php?iduser=${iduser}`
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.tk) && data.tk.length > 0) {
        // Lấy username từ phần tử đầu tiên
        setUsername(data.tk[0].username);
      } else {
        console.log(
          "Không tìm thấy tài khoản nào:",
          data.message || "Lỗi không xác định"
        );
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tài khoản:", error);
    }
  };

  const renderItem = ({ item }) => {
    return <Image source={item} style={styles.banner} resizeMode="cover" />;
  };

  // GET services
  const fetchServices = async () => {
    try {
      const response = await fetch(`${url}myapi/Dichvu/getDV.php`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data); //
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await fetch(`${url}myapi/Trungtam/getTT.php`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setCenters(data);
      } else {
        console.error("Data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching center:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={centers}
        keyExtractor={(item) => item.idtrungtam.toString()}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileSection}>
                <View style={styles.profileIcon}>
                  <Image
                    style={styles.headerImage}
                    source={require("../../asset/account.jpg")}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.helloText}>Xin chào, 👋</Text>
                  <Text style={styles.userName}> {username}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationIcon}>
                <Icon name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Banner */}
            <Carousel
              data={banners}
              renderItem={renderItem}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              loop={true}
              autoplay={true}
              autoplayInterval={2000}
            />

            {/* Search Bar */}

            <View style={styles.searchBar}>
              {/* Button to navigate to Search Screen 1 */}
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigation.navigate("ListServices")}
              >
                <Text style={styles.buttonText}>Tìm kiếm dịch vụ</Text>
              </TouchableOpacity>

              {/* Button to navigate to Search Screen 2 */}
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigation.navigate("ListCenters")}
              >
                <Text style={styles.buttonText}>Tìm kiếm trung tâm</Text>
              </TouchableOpacity>
            </View>

            {/* Service Speciality */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dịch vụ</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ListServices")}
              >
                <Text style={styles.seeAll}>Tất cả</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : (
              <FlatList
                horizontal
                data={services}
                keyExtractor={(item) => item.iddichvu.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.service}
                    onPress={() =>
                      navigation.navigate("ServiceDetailScreen", { item })
                    }
                  >
                    <View style={styles.speciality}>
                      <Image
                        source={{ uri: item.hinhanh }}
                        style={styles.specialityIcon}
                      />
                      <Text
                        style={styles.serviceName}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.tendichvu}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={true}
                pagingEnabled={true} // Bật hiệu ứng cuộn từng phần tử (snap từng trang)
                snapToAlignment="center" // Căn chỉnh phần tử tại vị trí giữa màn hình
                snapToInterval={150} // Khoảng cách giữa các snap points (chiều rộng từng item)
                decelerationRate="fast" // Cuộn mượt hơn (ngừng nhanh hơn khi không vuốt mạnh)
              />
            )}

            {/* List Center Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Gara cao cấp của chúng tôi
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ListCenters")}
              >
                <Text style={styles.seeAll}>Tất cả</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gara}
            onPress={() => navigation.navigate("CenterDetailScreen", { item })}
          >
            {/* Bao bọc hình ảnh trong View để thêm ngôi sao */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.hinhanh }} style={styles.garaImage} />
              <View style={styles.starIconContainer}>
                <Text>5 </Text>
                <Icon name="star" size={20} color="#FFD700" />
              </View>
            </View>
            <Text style={styles.garaName}>{item.tentrungtam}</Text>
            <Text>{item.diachi}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#fff",
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
  },

  searchButton: {
    backgroundColor: "#fff8dc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#333333",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  profileSection: {
    flexDirection: "row",
    marginLeft: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: 10,
  },
  helloText: {
    fontSize: 14,
    color: "#888",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationIcon: {
    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  banner: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: "red",
  },
  speciality: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  specialityIcon: {
    marginBottom: 5,
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  serviceName: {
    fontSize: 12,
    textAlign: "center",
  },
  gara: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  service: {
    width: 50,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: 150,
  },
  garaImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  starIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 5,
  },
  garaName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default HomeScreen;
