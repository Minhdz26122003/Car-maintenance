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
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../ipconfig";
import { Ionicons } from "@expo/vector-icons";

const ManageCarScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [Car, setCar] = useState([]);
  const [username, setUsername] = useState("");
  const [iduser, setIduser] = useState("");
  const [idxe, setIdxe] = useState("");
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    hangxe: "",
    namsx: "",
  });
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
    setLoading(true);
    try {
      const response = await fetch(`${url}myapi/Xe/getxe.php?iduser=${iduser}`);
      //console.log("iduser", iduser);
      const text = await response.text();
      // console.log("error", text);
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

  const handleUpdateCar = async (idxe) => {
    try {
      const response = await fetch(`${url}myapi/Xe/suaxe.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idxe: editingCar.idxe,
          iduser: editingCar.iduser,
          hangxe: formData.hangxe,
          namsx: formData.namsx,
        }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Thành công", "Cập nhật thông tin xe thành công!");
        fetchUserCar(iduser); // Tải lại danh sách xe
        setIsEditing(false);
      } else {
        Alert.alert("Lỗi", "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật xe:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Danh sách xe</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : isEditing ? ( // Nếu đang chỉnh sửa, hiển thị form chỉnh sửa
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Chỉnh sửa thông tin xe</Text>
          <TextInput
            style={styles.input}
            placeholder="Hãng xe"
            value={formData.hangxe}
            onChangeText={(text) => setFormData({ ...formData, hangxe: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Năm sản xuất"
            keyboardType="numeric"
            value={formData.namsx}
            onChangeText={(text) => setFormData({ ...formData, namsx: text })}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateCar}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={Car}
          keyExtractor={(item) => item.idxe.toString()}
          renderItem={({ item }) => (
            <View style={styles.carItem}>
              <View style={styles.containerxe}>
                <Image
                  source={require("../../asset/car1.jpg")}
                  style={styles.imagecar}
                />
                <View style={styles.inforcar}>
                  <Text>Biển số xe: {item.idxe}</Text>
                  <Text>Tên xe: {item.hangxe}</Text>
                  <Text>Năm sản xuất: {item.namsx}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCar(item);
                    setFormData({ hangxe: item.hangxe, namsx: item.namsx });
                    setIsEditing(true);
                  }}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={24} color="#fff" />
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
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    height: 45,
    width: 40,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 5, // Đổ bóng nhẹ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
export default ManageCarScreen;
