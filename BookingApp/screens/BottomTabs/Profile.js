import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../ipconfig";
import { Ionicons } from "@expo/vector-icons";
import { version } from "../../package.json";

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [password, setPassword] = useState("");
  const [diachi, setDiachi] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [email, setEmail] = useState("");

  // Đọc dữ liệu người dùng khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        const userData = await getUserData();
        if (userData) {
          setIduser(userData.iduser);
          // setPassword(userData.password);
          // setDiachi(userData.diachi);
          // setSodienthoai(userData.sodienthoai);
          // setEmail(userData.email);
          loadAccount(userData.iduser);
        }
      };

      loadUserData(); // Gọi hàm loadUserData mỗi khi màn hình được focus
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
        setUsername(data.tk[0].username); // Lấy username
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      navigation.navigate("LoginScreen", { replace: true });
    } catch (error) {
      console.error("Đăng xuất không thành công:", error);
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const data = [
    {
      key: "QLX",
      title: "Quản lý xe",
      description: "Quản lý thông tin những chiếc xe",
      icon: "car-sport-outline",
      onPress: () => handleNavigate("ManageCarScreen"),
    },
    {
      key: "QLLH",
      title: "Quản lý lịch hẹn",
      description: "Theo dõi trạng thái lịch hẹn của bạn",
      icon: "bookmark-outline",
      onPress: () => handleNavigate("ManageBookScreen"),
    },
    {
      key: "DMK",
      title: "Đổi mật khẩu",
      description: "Đổi mật khẩu cho tài khoản của bạn",
      icon: "bookmark-outline",
      onPress: () => handleNavigate("ChangePasswordScreen"),
    },
    {
      key: "DX",
      title: "Đăng xuất",
      icon: "log-out-outline",
      onPress: () => handleLogout(),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Thông tin người dùng */}
      <View style={styles.profileHeader}>
        <Image
          source={require("../../asset/account.jpg")}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <TouchableOpacity onPress={() => handleNavigate("InforPersonal")}>
            <Text style={styles.viewProfile}>Xem trang cá nhân</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Các mục quản lý */}
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={item.onPress}>
            <View style={styles.listItemContent}>
              <Ionicons name={item.icon} size={24} color="#0078FF" />
              <View style={styles.listText}>
                <Text style={styles.listTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.listDescription}>{item.description}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#F5F5F5",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginRight: 10,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewProfile: {
    fontSize: 14,
    color: "#0078FF",
    marginTop: 5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  listText: {
    marginLeft: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  listDescription: {
    fontSize: 14,
    color: "#999",
  },
});

export default ProfileScreen;
