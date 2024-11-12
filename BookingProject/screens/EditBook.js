import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const EditBookScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [ngayhen, setNgayHen] = useState(service.ngayhen);
  const [thoigianhen, setThoiGianHen] = useState(service.thoigianhen);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Hàm hiển thị Date Picker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Hàm hiển thị Time Picker
  const showTimePicker = () => {
    setTimePickerVisible(true);
  };
  // xử lý khi thay đổi ngày
  const onChangeDate = (even, date, selectedDate) => {
    const selected = selectedDate || date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showDatePicker(false);
      Alert.alert("Thông báo", "Ngày đã chọn không thể là ngày trong quá khứ.");
      setErrorMessage("Ngày đã chọn không thể là ngày trong quá khứ.");
    } else {
      setErrorMessage("");
      showDatePicker(false);
      setDate(selected); // Lưu lại đối tượng Date đã chọn
    }
  };
  // Hàm cập nhật thông tin lịch hẹn
  const updateBooking = async () => {
    try {
      const response = await fetch(`${url}myapi/Lichhen/sualichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idlichhen: service.idlichhen,
          ngayhen: ngayhen,
          thoigianhen: thoigianhen,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert("Thông báo", "Lịch hẹn đã được cập nhật!");
        navigation.goBack(); // Quay lại trang quản lý lịch hẹn
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật lịch hẹn.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch hẹn:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật lịch hẹn.");
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Chỉnh sửa lịch hẹn
      </Text>

      {/* Nhập ngày hẹn */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ngày hẹn:</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            style={styles.input}
            value={ngayhen ? ngayhen : ""} // Hiển thị chuỗi rỗng nếu ngayhen null
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* DateTimePicker cho ngày hẹn */}
      {datePickerVisible && (
        <DateTimePicker
          value={new Date(ngayhen || new Date())} // Đảm bảo giá trị không null
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setDatePickerVisible(false);
            if (event.type === "set" && selectedDate) {
              setNgayHen(selectedDate.toISOString().split("T")[0]); // Cập nhật ngày hẹn
            }
          }}
        />
      )}

      {/* Nhập thời gian hẹn */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Thời gian hẹn:</Text>
        <TouchableOpacity onPress={showTimePicker}>
          <TextInput
            style={styles.input}
            value={thoigianhen ? thoigianhen : ""} // Hiển thị chuỗi rỗng nếu thoigianhen null
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* DateTimePicker cho thời gian hẹn */}
      {timePickerVisible && (
        <DateTimePicker
          value={new Date()} // Sử dụng ngày hiện tại
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setTimePickerVisible(false);
            if (event.type === "set" && selectedTime) {
              const hours = selectedTime.getHours().toString().padStart(2, "0");
              const minutes = selectedTime
                .getMinutes()
                .toString()
                .padStart(2, "0");
              setThoiGianHen(`${hours}:${minutes}`); // Cập nhật giờ đã chọn
            }
          }}
        />
      )}

      {/* Nút cập nhật lịch hẹn */}
      <TouchableOpacity style={styles.updateButton} onPress={updateBooking}>
        <Text style={styles.updateButtonText}>Cập nhật lịch hẹn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditBookScreen;
