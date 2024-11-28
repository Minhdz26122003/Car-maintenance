import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const PaymentScreen = ({ route, navigation }) => {
  //const { bookingDetails } = route.params; // Nhận chi tiết đặt lịch từ màn hình trước đó
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const renderScene = SceneMap({
    active: ActiveTasks,
    completed: CompletedTasks,
    all: AllTasks,
  });
  const handlePayment = async () => {
    // Thực hiện thanh toán (giả lập ở đây)
    try {
      const response = await fetch("https://yourapi.com/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          cardHolder,
          expiryDate,
          cvv,
          totalAmount: bookingDetails.totalAmount, // Gửi tổng số tiền
          bookingId: bookingDetails.id, // ID của đặt lịch
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Thanh toán thành công", "Cảm ơn bạn đã thanh toán!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Lỗi thanh toán", data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh Toán</Text>
      <TextInput
        style={styles.input}
        placeholder="Số thẻ"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tên chủ thẻ"
        value={cardHolder}
        onChangeText={setCardHolder}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày hết hạn (MM/YY)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
      />
      <Text style={styles.amountText}>Tổng tiền:</Text>
      <Button title="Xác nhận thanh toán" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  amountText: {
    fontSize: 18,
    marginVertical: 15,
    textAlign: "center",
  },
});
export default PaymentScreen;
