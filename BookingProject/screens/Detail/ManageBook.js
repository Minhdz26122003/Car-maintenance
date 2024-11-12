import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const ManageBookScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [servicesHistory, setServicesHistory] = useState([]); // Lịch sử dịch vụ
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        setUsername(userData.username);

        fetchUserBook(userData.iduser);
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

  // Load danh sách lịch hẹn
  const fetchUserBook = async (iduser) => {
    try {
      const response = await fetch(
        `${url}myapi/Lichhen/getLh.php?iduser=${iduser}`
      );
      const data = await response.json();
      if (data.success) {
        setServicesHistory(data.lichhen);
      } else {
        Alert.alert("Lỗi", "Không có lịch sử dịch vụ.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Quản lý lịch hẹn</Text>
      </View>

      <FlatList
        data={servicesHistory}
        keyExtractor={(item) => item.idlichhen.toString()}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Text>Dịch vụ: {item.tendichvu}</Text>
            <Text>Ngày hẹn: {item.ngayhen}</Text>
            <Text>Thời gian: {item.thoigianhen}</Text>
            <Text>Trạng thái: {item.trangthai}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditBookScreen", {
                  service: {
                    idlichhen: item.idlichhen,
                    ngayhen: item.ngayhen,
                    thoigianhen: item.thoigianhen,
                    trangthai: item.trangthai,
                    tendichvu: item.tendichvu,
                  },
                })
              }
            >
              <Text style={styles.editButtonText}>Sửa lịch hẹn</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  serviceItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  editButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ManageBookScreen;
