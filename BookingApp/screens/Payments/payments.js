import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import axios from "axios";
import { Linking } from "react-native"; // Import Linking để mở URL

const PaymentScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("Thanh toán React Native");

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${url}myapi/Thanhtoan/vnpay_return.php`,
        {
          amount: 100000, // Số tiền thanh toán
          orderInfo: orderInfo,
          orderId: Date.now(), // Mã đơn hàng có thể là ID duy nhất
        }
      );

      if (response.data.url) {
        Linking.openURL(response.data.url);
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    }
  };

  return (
    <View>
      <Text>Thanh toán VNPay</Text>
      <Button onPress={handlePayment} title="Thanh toán VNPay" />
    </View>
  );
};

export default PaymentScreen;
