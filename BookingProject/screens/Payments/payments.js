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

const PaymentScreen = ({ route, navigation }) => {
  const {
    idlichhen,
    username,
    sodienthoai,
    idxe,
    selectedCenter,
    selectedServices,
    ngayhen,
    thoigianhen,
    tongtien,
  } = route.params;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = async () => {
    try {
      const paymentData = {
        idlichhen,
        ngaythanhtoan: new Date().toISOString().split("T")[0],
        hinhthuc: "Chuyển khoản",
        trangthai: "Đang xử lý",
        tongtien: parseFloat(tongtien.replace(/[^0-9.-]+/g, "")),
      };

      const response = await fetch(`${url}/Thanhtoan/taothanhtoan.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      console.log("Thanh toán", result);

      if (result.success) {
        Alert.alert("Thành công", result.message);
        navigation.goBack(); // Quay lại trang trước hoặc chuyển sang trang khác
      } else {
        Alert.alert("Lỗi", result.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
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
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState([]);

//   const submitComment = () => {
//     if (comment.trim()) {
//       setComments([...comments, { rating, text: comment }]);
//       setComment("");
//       setRating(0);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Bảng đánh giá */}
//       <Text style={styles.title}>Đánh giá</Text>
//       <View style={styles.ratingContainer}>
//         {[1, 2, 3, 4, 5].map((value) => (
//           <TouchableOpacity
//             key={value}
//             onPress={() => setRating(value)}
//             style={[
//               styles.star,
//               { backgroundColor: rating >= value ? "#ffd700" : "#ddd" },
//             ]}
//           >
//             <Text style={styles.starText}>★</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Nhập bình luận */}
//       <Text style={styles.title}>Bình luận</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Nhập bình luận của bạn..."
//         value={comment}
//         onChangeText={(text) => setComment(text)}
//       />

//       {/* Nút gửi */}
//       <TouchableOpacity style={styles.button} onPress={submitComment}>
//         <Text style={styles.buttonText}>Gửi</Text>
//       </TouchableOpacity>

//       {/* Danh sách bình luận */}
//       <FlatList
//         data={comments}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.commentItem}>
//             <Text style={styles.commentText}>
//               {`Đánh giá: ${item.rating} ★`}
//             </Text>
//             <Text style={styles.commentText}>{item.text}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: "#fff", flex: 1 },
//   title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
//   ratingContainer: { flexDirection: "row", marginBottom: 20 },
//   star: { padding: 10, borderRadius: 5, marginHorizontal: 5 },
//   starText: { fontSize: 20, color: "#fff" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   button: {
//     backgroundColor: "#28a745",
//     padding: 10,
//     alignItems: "center",
//     borderRadius: 5,
//     marginBottom: 20,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
//   commentItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   commentText: { fontSize: 16 },
// });
export default PaymentScreen;
