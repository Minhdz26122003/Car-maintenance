import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import { Ionicons } from "@expo/vector-icons";

const ManageCarScreen = () => {
  const [loading, setLoading] = useState(true);
  const [Car, setCar] = useState([]);
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [idxe, setIdxe] = useState("");

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
      //console.log("iduser", iduser);
      const text = await response.text();
      console.log("error", text);
      const data = JSON.parse(text);
      if (data.success) {
        setCar(data.xe);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // const deleteCar = async (idxe, iduser) => {
  //   Alert.alert(
  //     "Xác nhận",
  //     "Bạn có chắc chắn muốn xóa xe này không?",
  //     [
  //       {
  //         text: "Hủy",
  //         style: "cancel",
  //       },
  //       {
  //         text: "Xóa",
  //         onPress: async () => {
  //           try {
  //             const response = await fetch(`${url}myapi/Xe/xoaxe.php`, {
  //               method: "DELETE",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({ idxe, iduser }),
  //             });

  //             const text = await response.text();
  //             console.log("Phản hồi từ server dạng text:", text);
  //             const data = JSON.parse(text);
  //             if (data.success) {
  //               Alert.alert("Thành công", "Xóa xe thành công!");
  //               fetchCars(); // Cập nhật danh sách xe
  //             } else {
  //               Alert.alert("Lỗi", `Xóa xe thất bại: ${data.message}`);
  //             }
  //           } catch (error) {
  //             console.error("Lỗi khi xóa xe:", error);
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Danh sách xe</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={Car}
          keyExtractor={(item) => item.idxe.toString()}
          renderItem={({ item }) => (
            <View style={styles.carItem}>
              <View style={styles.containerxe}>
                <Image
                  source={require("D:/Documents/ReactJS/DoAn4/BookingProject/assets/background1.jpg")}
                  style={styles.imagecar}
                />
                <View style={styles.inforcar}>
                  <Text>Biển số xe: {item.idxe}</Text>
                  <Text>Hãng xe: {item.hangxe}</Text>
                  <Text>Năm sản xuất: {item.namsx}</Text>
                </View>

                {/* <TouchableOpacity
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
                  <Ionicons name="create-outline" size={24} color="#ff0000" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteCar(item.idxe, iduser)}>
                  <Ionicons name="trash-outline" size={24} color="#ff0000" />
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  containerxe: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagecar: {
    width: 90,
    height: 100,
  },
  inforcar: {
    paddingLeft: 20,
  },
  carItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: "#000",
    borderWidth: 0.1,
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
