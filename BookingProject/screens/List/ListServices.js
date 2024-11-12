import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const ListServices = () => {
  const [user, setUser] = useState(null);
  const [Services, setService] = useState([]);
  //   const [username, setUsername] = useState("");
  //   const [iduser, setIduser] = useState("");

  useEffect(() => {
    // const loadUserData = async () => {
    //   const userData = await getUserData();
    //   if (userData) {
    //     setIduser(userData.iduser);
    //     setUsername(userData.username);
    //     fetchUserCar(userData.iduser);
    //   }
    // };
    // loadUserData();
    fetchServices();
  }, []);

  //   // Lấy thông tin người dùng
  //   const getUserData = async () => {
  //     try {
  //       const jsonValue = await AsyncStorage.getItem("userData");
  //       return jsonValue != null ? JSON.parse(jsonValue) : null;
  //     } catch (error) {
  //       console.error("Lỗi lấy thông tin người dùng:", error);
  //       return null;
  //     }
  //   };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${url}myapi/Dichvu/getDV.php`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setService(data); //
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Danh sách Dịch vụ</Text>
      </View>

      <FlatList
        data={Services}
        keyExtractor={(item) => item.iddichvu.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.iddichvu}
            style={styles.serviceItem}
            onPress={() =>
              navigation.navigate("ServiceDetailScreen", {
                dichvu: {
                  iddichvu: item.iddichvu,
                  tendichvu: item.tendichvu,
                  mota: item.mota,
                  gia: item.gia,
                  thoigianth: item.thoigianth,
                },
              })
            }
          >
            <Image
              style={styles.image}
              source={{ uri: item.hinhanh }}
              resizeMode="contain"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.serviceText}>
                Tên dịch vụ: {item.tendichvu}
              </Text>
              <Text style={styles.serviceText}>Mô tả: {item.mota}</Text>
              <Text style={styles.serviceText}>Giá: {item.gia}</Text>
              <Text style={styles.serviceText}>
                Thời gian thực hiện: {item.thoigianth}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between", // Sắp xếp các phần tử cách đều nhau
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
export default ListServices;
