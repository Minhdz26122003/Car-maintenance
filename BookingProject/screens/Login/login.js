import React, { useEffect, useState } from "react";
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
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
import Icon from "react-native-vector-icons/MaterialIcons";
import url from "../../ipconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
const { width, height } = Dimensions.get("window");
const COLORS = { primary: "#007260", white: "#fff" };

// export const signIn = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const response = await GoogleSignin.signIn();
//     console.log(userInfo.user);
//   } catch (error) {
//     if (isErrorWithCode(error)) {
//       switch (error.code) {
//         case statusCodes.IN_PROGRESS:
//           console.log("something went wrong");
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           console.log("something went wrong");
//           break;
//         default:
//           console.log("something went wrong");
//       }
//     } else {
//       // an error that's not related to google sign in occurred
//     }
//   }
// };
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // WebBrowser.maybeCompleteAuthSession();

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId:
  //     "343699737457-blsp7dee6ev3m93rje8noidchl3fjmp7.apps.googleusercontent.com",
  // });

  // const handleToken = async () => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     const token = authentication?.accessToken;
  //     console.log("Access Token:", token);

  //     // Lấy thông tin người dùng từ Google API
  //     const userInfoResponse = await fetch(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const userInfo = await userInfoResponse.json();

  //     console.log("User Info:", userInfo);
  //     navigation.navigate("Home", {
  //       username: userInfo.name,
  //       image: userInfo.picture,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   handleToken(); // Kiểm tra xem đã có phản hồi chưa
  // }, [response]);

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Lỗi lưu thông tin người dùng:", error);
    }
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
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

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        const userData = {
          iduser: data.user.iduser,
          username: data.user.username,
          email: data.user.email,
          password: data.user.password,
          sodienthoai: data.user.sodienthoai,
          diachi: data.user.diachi,
          vaitro: data.user.vaitro,
        };
        await storeUserData(userData);
        setEmail("");
        setPassword("");
        printStoredData();
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
  const printStoredData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        console.log("Stored User Data:", JSON.parse(userData));
      } else {
        console.log("No data found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching stored data:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/car5.jpg")}
        style={styles.backgroundImage}
      />

      <Text style={styles.title}>Đăng nhập</Text>
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
          placeholder="Mật khẩu"
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
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Hoặc</Text>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://img.icons8.com/color/48/000000/google-logo.png",
            }}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
        <Text style={styles.createText}>
          Bạn không có tài khoản? <Text style={styles.createLink}>Tạo mới</Text>
        </Text>
      </TouchableOpacity>
    </View>
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
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
    zIndex: -1,
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
  },
});

export default LoginScreen;
