import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Hàm xử lý khi nhấn nút Đăng nhập
  const handleLogin = async () => {
    // Kiểm tra nếu email hoặc password trống
    if (email === "" || password === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      // Gọi API để xác thực thông tin đăng nhập
      const response = await fetch("http://192.168.1.4/myapi/dangnhap.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const responseText = await response.text(); // Lấy phản hồi dưới dạng văn bản
      console.log("Response text:", responseText); // In ra phản hồi để xem
      const data = JSON.parse(responseText); // Cố gắng chuyển đổi văn bản thành JSON

      if (data.success) {
        navigation.navigate("WelcomeScreen");
      } else {
        Alert.alert("Đăng nhập thất bại", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Hello There!</Text>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

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
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/50/000000/facebook-new.png",
            }}
            style={styles.icon}
          />
        </TouchableOpacity> */}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.createText}>
          Don’t have an account? <Text style={styles.createLink}>Create</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
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
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default LoginScreen;
