import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import url from "../../ipconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");
const ChangePasswordScreen = ({ navigation }) => {
  const [iduser, setIduser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        setUsername(userData.username);
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
  const ChangePass = async () => {
    // Kiểm tra xem tất cả các trường đã nhập chưa và mật khẩu có trùng khớp
    if (username === "" || password === "" || confirmPassword === "") {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn đổi mật khẩu của tài khoản này không?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(
        `${url}myapi/Taikhoan/doimatkau.php?iduser=${iduser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.success) {
        Alert.alert("Thành công", "Đăng ký thành công. Hãy đăng nhập.");
        setPassword("");
        setUsername("");
      } else {
        Alert.alert("Đăng ký thất bại", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container_su}>
      <Image
        source={require("../../asset/car5.jpg")}
        style={styles.backgroundimage_su}
      />
      <Text style={styles.title_su}>Đổi mật khẩu</Text>
      <Text style={styles.title}>Tài khoản</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input_su}
          placeholder="User Name"
          readOnly
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
      <Text style={styles.title}>Mật khẩu cũ</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input_su}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Icon
          style={styles.icon_pass}
          name={showPassword ? "visibility" : "visibility-off"}
          size={24}
          color="gray"
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>
      <Text style={styles.title}>Nhập lại mật khẩu</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input_su}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
        />
        <Icon
          style={styles.icon_pass}
          name={showPassword ? "visibility" : "visibility-off"}
          size={24}
          color="gray"
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <TouchableOpacity onPress={ChangePass} style={styles.button_su}>
        <Text style={styles.buttonText_su}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container_su: {
    flex: 1,
    justifyContent: "center",
    padding: 20,

    backgroundColor: "#f7f7f7",
  },
  backgroundimage_su: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    zIndex: -1,
    opacity: 0.3,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10,
    textAlign: "left",
    color: "#333",
  },
  title_su: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input_su: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontWeight: "bold",
    width: 360,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  icon_pass: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  link_su: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  button_su: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
  },
  buttonText_su: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  footerText_su: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});

export default ChangePasswordScreen;
