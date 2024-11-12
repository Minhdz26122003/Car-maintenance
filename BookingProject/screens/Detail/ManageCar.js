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

const ManageCarScreen = () => {
  const [user, setUser] = useState(null);
  const [Car, setCar] = useState([]);
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        setUsername(userData.username);

        fetchUserCar(userData.iduser);
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

  const fetchUserCar = async (iduser) => {
    try {
      const response = await fetch(`${url}myapi/Xe/getxe.php?iduser=${iduser}`);
      console.log("iduser", iduser);
      const text = await response.text(); // Đọc phản hồi dạng text
      console.log("error", text); // In ra để xem nội dung
      const data = JSON.parse(text); // Chuyển đổi sang JSON sau khi đã kiểm tra
      if (data.success) {
        setCar(data.xe);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy xe");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Danh sách xe</Text>
      </View>

      <FlatList
        data={Car}
        keyExtractor={(item) => item.idxe.toString()}
        renderItem={({ item }) => (
          <View style={styles.carItem}>
            <Text>Biển số xe: {item.idxe}</Text>
            <Text>Hãng xe: {item.hangxe}</Text>
            <Text>Năm sản xuất: {item.namsx}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditCarScreen", {
                  car: {
                    idxe: item.idxe,
                    hangxe: item.hangxe,
                    namsx: item.namsx,
                  },
                })
              }
            >
              <Text style={styles.editButtonText}>Sửa thông tin xe</Text>
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
  carItem: {
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
export default ManageCarScreen;
