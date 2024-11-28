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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [diachi, setDiachi] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [email, setEmail] = useState("");
  const [vaitro, setVaitro] = useState("");

  // Fetch data from APIs
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUsername(userData.username);
        setPassword(userData.password);
        setDiachi(userData.diachi);
        setSodienthoai(userData.sodienthoai);
        setEmail(userData.email);
        setVaitro(userData.vaitro);
      }
    };

    loadUserData();
    fetchServices();
    fetchCenters();
  }, []);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
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
                    source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/account.jpg")}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.helloText}>Hello, 👋</Text>
                  <Text style={styles.userName}> {username}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.notificationIcon}>
                <Icon name="notifications-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <TextInput placeholder="Search" style={styles.searchInput} />
            </View>

            {/* Banner */}
            <Image
              source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/Banner.jpg")}
              style={styles.banner}
            />

            {/* Service Speciality */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dịch vụ</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ListServices")}
              >
                <Text style={styles.seeAll}>See All</Text>
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
                        numberOfLines={1}
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
                <Text style={styles.seeAll}>See All</Text>
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
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    height: 150,
    marginVertical: 10,
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
    color: "#4CAF50",
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
    fontSize: 14,
    fontWeight: "500",
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
    paddingHorizontal: 16,
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
