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
import url from "../../ipconfig";
import { Ionicons } from "@expo/vector-icons";

const ManageReviewScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReview] = useState([]);
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [iddanhgia, setIddanhgia] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        setUsername(userData.username);
        fetchReview(userData.iduser);
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

  const fetchReview = async (iduser) => {
    try {
      const response = await fetch(
        `${url}myapi/Danhgia/getdgbyiduser.php?iduser=${iduser}`
      );
      //console.log("iduser", iduser);
      const text = await response.text();
      //   console.log("error", text);
      const data = JSON.parse(text);
      if (data.success) {
        setReview(data.danhgia);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const deletereview = async (iddanhgia, iduser) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa bình luận này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const response = await fetch(
                `${url}myapi/Danhgia/xoadanhgia.php`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ iddanhgia, iduser }),
                }
              );

              const text = await response.text();
              const data = JSON.parse(text);
              if (data.success) {
                Alert.alert("Thành công", "Xóa bình luận thành công!");
                navigation.goBack();
              } else {
                Alert.alert("Lỗi", `Xóa bình luận thất bại: ${data.message}`);
              }
            } catch (error) {
              console.error("Lỗi khi xóa xe:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Danh sách bình luận</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.iddanhgia.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <View style={styles.containerxe}>
                <Image
                  source={require("../../asset/account.jpg")}
                  style={styles.imagereview}
                />
                <View style={styles.inforreview}>
                  <Text>Tên trung tâm: {item.tentrungtam}</Text>
                  <Text>Nội dung: {item.noidung}</Text>
                  <Text>Đánh giá: {item.danhgia} sao</Text>
                  <Text>Ngày bình luận: {item.ngaybinhluan}</Text>
                </View>

                {/* <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditreviewScreen")}
                >
                  <Ionicons name="create-outline" size={24} color="#ff0000" />
                </TouchableOpacity>*/}

                <TouchableOpacity
                  onPress={() => deletereview(item.iddanhgia, iduser)}
                >
                  <Ionicons name="trash-outline" size={24} color="#ff0000" />
                </TouchableOpacity>
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
    justifyContent: "space-around",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "center",
    marginBottom: 20,
  },
  imagereview: {
    width: 50,
    height: 50,
  },
  inforreview: {
    paddingLeft: 20,
  },
  reviewItem: {
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
export default ManageReviewScreen;
