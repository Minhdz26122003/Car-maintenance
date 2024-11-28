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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import { Ionicons } from "@expo/vector-icons";

const InforPersonal = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [password, setPassword] = useState("");
  const [diachi, setDiachi] = useState("");
  const [sodienthoai, setSodienthoai] = useState("");
  const [vaitro, setStatus] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    loadUserData();
  }, []);
  const loadUserData = async () => {
    const userData = await getUserData();
    if (userData) {
      setIduser(userData.iduser);
      setUsername(userData.username);
      setPassword(userData.password);
      setDiachi(userData.diachi);
      setSodienthoai(userData.sodienthoai);
      setEmail(userData.email);
      setStatus(userData.vaitro);
    }
  };
  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };

  const convertTrangThai = (setStatus) => {
    const trangThaiMap = {
      0: "Khách hàng",
      1: "Nhân viên",
      2: "Admin hệ thống",
    };
    return trangThaiMap[setStatus] || "Không xác định";
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          {/* Ảnh nền */}
          <Image
            source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/Banner.jpg")}
            style={styles.backgroundImage}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/account.jpg")}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => alert("Change Avatar")}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.username}>{username}</Text>
        <Text style={styles.userEmail}>{email}</Text> */}
        </View>

        <View style={styles.containerrow}>
          <Text style={styles.tittle}>Thông tin cá nhân</Text>
          <View style={styles.inforrow}>
            <View style={styles.about}>
              <Ionicons
                style={styles.icon_pass}
                name="person-outline"
                size={24}
                color="#0078FF"
              />
              <TextInput>{username}</TextInput>
            </View>
          </View>
          <View style={styles.inforrow}>
            <View style={styles.about}>
              <Ionicons
                style={styles.icon_pass}
                name="mail-outline"
                size={24}
                color="#0078FF"
              />
              <TextInput>{email}</TextInput>
            </View>
          </View>
          <View style={styles.inforrow}>
            <View style={styles.about}>
              <Ionicons
                style={styles.icon_pass}
                name="map-outline"
                size={24}
                color="#0078FF"
              />
              <TextInput>{diachi}</TextInput>
            </View>
          </View>
          <View style={styles.inforrow}>
            <View style={styles.about}>
              <Ionicons
                style={styles.icon_pass}
                name="call-outline"
                size={24}
                color="#0078FF"
              />
              <TextInput>{sodienthoai}</TextInput>
            </View>
          </View>
        </View>

        <View style={styles.containerrow}>
          <Text style={styles.tittle}>Thông tin tài khoản</Text>
          <View style={styles.accrow}>
            <View style={styles.accabout}>
              <Ionicons
                style={styles.icon_pass}
                name="person-outline"
                size={24}
                color="#0078FF"
              />
              <Text>{email} </Text>
            </View>
          </View>
          <View style={styles.accrow}>
            <View style={styles.accabout}>
              <Ionicons
                style={styles.icon_pass}
                name="people-outline"
                size={24}
                color="#0078FF"
              />
              <Text>{convertTrangThai(vaitro)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.containerrow}>
          <TouchableOpacity style={styles.btn} onPress={() => ds}>
            <Text style={styles.btnText}> Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "#f5f5f5",
  },
  containerrow: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    marginBottom: 10,
  },
  profileHeader: {
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: 180,
    position: "absolute",
    resizeMode: "cover",
    top: 0,
  },
  avatarContainer: {
    marginTop: 100,
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#0078FF",
    borderRadius: 15,
    padding: 5,
  },
  tittle: {
    fontWeight: 30,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  inforrow: {
    marginHorizontal: 10,
    alignItems: "center",
  },

  about: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: "bold",
    width: 380,
    backgroundColor: "#f5f5f5",
  },
  accrow: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  accabout: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: "bold",
    width: 350,
    backgroundColor: "#e0ffff",
  },
  icon_pass: {
    paddingRight: 20,
  },
  btn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    width: 350,

    alignSelf: "center",
    fontWeight: "bold",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default InforPersonal;
