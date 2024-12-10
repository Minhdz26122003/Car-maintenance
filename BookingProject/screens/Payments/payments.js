import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import axios from "axios";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
const PaymentScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState("Thanh toán React Native");

  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost/vnpay_payment.php", {
        amount: 100000, // Số tiền thanh toán
      });
      if (response.data.url) {
        window.location.href = response.data.url; // Chuyển đến URL thanh toán
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    }
  };

  return <button onClick={handlePayment}>Thanh toán VNPay</button>;
};

export default PaymentScreen;
