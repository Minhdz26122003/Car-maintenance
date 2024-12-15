import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "../../ipconfig";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
const PaymentScreen = ({ route, navigation }) => {
  const { idlichhen } = route.params;
  const [lichHen, setLichHen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán tại khi đến nơi"
  );
  const [Price, setPrice] = useState("");
  useEffect(() => {
    const loadLichHen = async () => {
      try {
        const response = await axios.get(
          `${url}myapi/Thanhtoan/getlichhen.php`,
          {
            params: { idlichhen },
          }
        );
        // console.log(response.data);
        if (response.data.success) {
          setPrice(response.data.lichhen[0].tongtien);
          setLichHen(response.data.lichhen);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLichHen();
  }, [idlichhen]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />;
  }
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${url}myapi/Thanhtoan/taohoadon.php`,
        {
          idlichhen: idlichhen,
          ngaythanhtoan: new Date().toISOString(),
          hinhthuc: paymentMethod,
          tongtien: Price,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);
      if (response.data.success) {
        alert("Thanh toán thành công!");
        navigation.back();
      } else {
        alert("Đã có lỗi khi thanh toán");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối khi thanh toán");
    }
  };

  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };
  if (!lichHen) {
    return <Text>Không có dữ liệu lịch hẹn</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thanh toán lịch hẹn</Text>

      <FlatList
        vertical
        data={lichHen}
        keyExtractor={(item) => item.idlichhen.toString()}
        renderItem={({ item }) => (
          <View style={styles.containerinfor}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Tên người dùng: </Text>
              <Text>{item.username}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Số điện thoại:</Text>
              <Text>{item.sodienthoai}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Biển số xe: </Text>
              <Text>{item.idxe}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Trung tâm: </Text>
              <Text>{item.tentrungtam}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Dịch vụ:</Text>
              <Text
                style={{ flex: 1, textAlign: "right" }}
                numberOfLines={10}
                ellipsizeMode="tail"
              >
                {" "}
                {item.tendichvu}
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Ngày hẹn: </Text>
              <Text>{item.ngayhen}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Giờ hẹn: </Text>
              <Text>{item.thoigianhen}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Tổng tiền:</Text>
              <Text>{formatPrice(item.tongtien)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.paymentMethodSection}>
        <Text style={styles.label2}>Chọn phương thức thanh toán</Text>

        <TouchableOpacity
          style={[
            styles.button,
            paymentMethod === "Thanh toán trực tiếp" && styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod("Thanh toán trực tiếp")}
        >
          <Text style={styles.buttonText}>Thanh toán trực tuyến</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            paymentMethod === "Thanh toán tại khi đến nơi" &&
              styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod("Thanh toán tại khi đến nơi")}
        >
          <Text style={styles.buttonText}>Thanh toán khi đến nơi</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === "Thanh toán trực tiếp" && (
        <ScrollView>
          <View style={styles.discountSection}>
            <Image
              source={require("../../asset/qrpay.jpg")}
              style={styles.imageqr}
            />

            <View>
              <Text style={styles.header}>Thông tin tài khoản</Text>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Ngân hàng:</Text>
                <Text>MB Bank</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Chủ tài khoản:</Text>
                <Text>NGUYỄN NGỌC MINH</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Số tài khoản:</Text>
                <Text>2261220036868</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Số tiền:</Text>
                <Text>{formatPrice(lichHen[0]?.tongtien)}</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Nội dung CK:</Text>
                <Text>CK sửa xe </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity style={[styles.buttonxn]} onPress={handlePayment}>
        <Text style={styles.buttonTextxn}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  infoSection: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,

    borderRadius: 7,
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: "600",
  },
  label2: {
    fontSize: 16,
    marginVertical: 5,
  },
  paymentMethodSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonxn: {
    backgroundColor: "#4CAF50",
    padding: 11,
    marginHorizontal: 10,
    marginBottom: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonTextxn: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  selectedButton: {
    backgroundColor: "#daa520",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
  },
  discountSection: {
    marginBottom: 20,

    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imageqr: {
    paddingVertical: 40,
    alignSelf: "center",
    resizeMode: "contain",
    width: 300,
    height: 300,
  },
});

export default PaymentScreen;
