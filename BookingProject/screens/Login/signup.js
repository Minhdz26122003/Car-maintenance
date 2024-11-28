import React, { useState } from "react";
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

const { width, height } = Dimensions.get("window");
const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sodienthoai, setSdt] = useState("");
  const [diachi, setDiachi] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // Kiểm tra xem tất cả các trường đã nhập chưa và mật khẩu có trùng khớp
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      diachi === "" ||
      sodienthoai === ""
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Kiểm tra định dạng số điện thoại (có thể tùy chỉnh theo yêu cầu)
    if (isNaN(sodienthoai) || sodienthoai.length < 10) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }

    try {
      const response = await fetch(`${url}myapi/dangky.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          sodienthoai: sodienthoai,
          diachi: diachi,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Thành công", "Đăng ký thành công. Hãy đăng nhập.");
        setEmail("");
        setPassword("");
        setDiachi("");
        setSdt("");
        setUsername("");
        navigation.navigate("LoginScreen");
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
        source={require("../../assets/car5.jpg")}
        style={styles.backgroundimage_su}
      />
      <Text style={styles.title_su}>Đăng ký</Text>
      <TextInput
        style={styles.input_su}
        placeholder="Tài khoản"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input_su}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input_su}
        placeholder="Mật khẩu"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input_su}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <TextInput
        style={styles.input_su}
        placeholder="Địa chỉ"
        onChangeText={(text) => setDiachi(text)}
        value={diachi}
      />
      <TextInput
        style={styles.input_su}
        placeholder="Số điện thoại"
        onChangeText={(text) => setSdt(text)}
        value={sodienthoai}
        keyboardType="numeric" // Thay đổi kiểu bàn phím cho số điện thoại
      />

      <TouchableOpacity onPress={handleRegister} style={styles.button_su}>
        <Text style={styles.buttonText_su}>Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.footerText_su}>
          Bạn đã có tài khoản? <Text style={styles.link_su}>Đăng nhập</Text>
        </Text>
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
    backgroundColor: "#fff", // Thêm màu nền cho trường nhập liệu
  },
  link_su: {
    color: "black",
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

export default SignupScreen;
