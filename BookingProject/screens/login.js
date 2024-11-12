import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import Icon from "react-native-vector-icons/MaterialIcons";
import url from "../ipconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

const { width, height } = Dimensions.get("window");
const COLORS = { primary: "#007260", white: "#fff" };
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Hàm lưu thông tin vào AsyncStorage
  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Lỗi lưu thông tin người dùng:", error);
    }
  };

  const handleLogin = async () => {
    // Kiểm tra nếu email hoặc password trống
    if (email === "" || password === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      // Gọi API để xác thực thông tin đăng nhập
      const response = await fetch(`${url}myapi/dangnhap.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        throw new Error("Lỗi mạng, không thể kết nối đến máy chủ.");
      }

      const data = await response.json(); // Lấy phản hồi dưới dạng JSON
      console.log("Response data:", data); // In ra phản hồi để xem

      if (data.success) {
        const userData = {
          iduser: data.user.iduser,
          username: data.user.username,
          email: data.user.email,
          password: data.user.password,
          sodienthoai: data.user.sodienthoai,
          diachi: data.user.diachi,
          vaitro: data.vaitro,
        };
        await storeUserData(userData);

        // Xóa thông tin đăng nhập đã nhập
        setEmail("");
        setPassword("");

        // Chuyển hướng tới trang "HomeTabs"
        navigation.replace("HomeTabs", { username: data.user.username });
      } else {
        Alert.alert("Đăng nhập thất bại", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="343699737457-kgd2r3p71pn00p7tqehfrreb85v75c0h.apps.googleusercontent.com">
      <View style={styles.container}>
        <Image
          source={require("../assets/car5.jpg")} // Đường dẫn đến hình nền
          style={styles.backgroundImage}
        />

        <View></View>
        <Text style={styles.greetingText}>Hello There!</Text>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/google-logo.png",
              }}
              style={styles.icon}
            />
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse?.credential);
                console.log(decoded);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            ;
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
          <Text style={styles.createText}>
            Don’t have an account? <Text style={styles.createLink}>Create</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </GoogleOAuthProvider>
  );
};

const styles = StyleSheet.create({
  ///login style
  container: {
    flex: 1,
    fontWeight: "bold",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
    position: "relative", // Giúp căn chỉnh các thành phần so với hình nền
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover", // Phủ kín hình nền
    zIndex: -1, // Đưa hình nền xuống dưới
    opacity: 0.5,
  },
  greetingText: {
    fontSize: 28,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 5,
  },

  icon_pass: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    fontWeight: "bold",
    padding: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    fontWeight: "bold",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  createText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  createLink: {
    color: "#111111",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default LoginScreen;
