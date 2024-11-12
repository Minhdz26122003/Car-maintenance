import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [password, setPassword] = useState("");
  const [diachi, setDiachi] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        setUsername(userData.username);
        setPassword(userData.password);
        setDiachi(userData.diachi);
        setSodienthoai(userData.sodienthoai);
        setEmail(userData.email);
      }
    };

    loadUserData();
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      Alert.alert("Thông báo", "Bạn đã đăng xuất thành công!");
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Đăng xuất không thành công:", error);
    }
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[
          {
            key: "profileHeader",
            content: (
              <View style={styles.profileHeader}>
                <Image
                  source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/background1.jpg")}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleNavigate("EditProfileScreen")}
                >
                  <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              </View>
            ),
          },
          {
            key: "manageCar",
            content: (
              <TouchableOpacity
                style={styles.section}
                onPress={() => handleNavigate("ManageCarScreen")}
              >
                <Text style={styles.sectionTitle}>Quản lý xe</Text>
              </TouchableOpacity>
            ),
          },
          {
            key: "manageAppointment",
            content: (
              <TouchableOpacity
                style={styles.section}
                onPress={() => handleNavigate("ManageBookScreen")}
              >
                <Text style={styles.sectionTitle}>Quản lý lịch hẹn</Text>
              </TouchableOpacity>
            ),
          },
          {
            key: "settings",
            content: (
              <TouchableOpacity
                style={styles.section}
                onPress={() => handleNavigate("SettingsScreen")}
              >
                <Text style={styles.sectionTitle}>Cài đặt</Text>
              </TouchableOpacity>
            ),
          },
          {
            key: "logoutButton",
            content: (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            ),
          },
        ]}
        renderItem={({ item }) => item.content}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f9f9f9",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
