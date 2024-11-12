import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BookingScreen = ({ navigation }) => {
  const [iduser, setIduser] = useState("");
  const [username, setUsername] = useState("");
  const [sodienthoai, setPhoneNumber] = useState("");
  const [idxe, setBiensoxe] = useState("");
  const [hangxe, setCarBrand] = useState("");
  const [namsx, setYearcar] = useState("");
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState(new Date()); // Đảm bảo biến này luôn là đối tượng Date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [cars, setCars] = useState([]); // Lưu danh sách xe từ API
  const [selectedCar, setSelectedCar] = useState(""); // Xe đã chọn
  const [isNewCar, setIsNewCar] = useState(false); // Xác định có phải xe mới không

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setUsername(userData.username); // Lấy username từ thông tin người dùng
        setPhoneNumber(userData.sodienthoai);
        setIduser(userData.iduser);
      }
    };
    const loadData = async () => {
      await loadUserData();
      await loadCenters();
      await loadCars();
    };

    loadData(); // Load user data, centers, and cars
    if (selectedCenter) {
      fetchServicesByCenter(selectedCenter);
    } else {
      setServices([]); // Reset service list if no center is selected
    }
  }, [selectedCenter]);

  // Lấy thông tin user từ store
  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };

  //load center
  const loadCenters = async () => {
    try {
      const response = await fetch(`${url}myapi/Trungtam/getTT.php`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCenters(data); //
      }
    } catch (error) {
      console.error("Error loading centers: ", error);
    }
  };

  const loadCars = async () => {
    try {
      const response = await fetch(`${url}/myapi/Xe/getallxe.php`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCars(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách xe:", error);
    }
  };
  // load dịch vụ theo center
  const fetchServicesByCenter = async (selectedCenter) => {
    try {
      const response = await fetch(
        `${url}/myapi/getDVforCT.php?idtrungtam=${selectedCenter}`
      );

      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // xử lý khi thay đổi ngày
  const onChangeDate = (even, date, selectedDate) => {
    const selected = selectedDate || date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      setShowDatePicker(false);
      Alert.alert("Thông báo", "Ngày đã chọn không thể là ngày trong quá khứ.");
      setErrorMessage("Ngày đã chọn không thể là ngày trong quá khứ.");
    } else {
      setErrorMessage("");
      setShowDatePicker(false);
      setDate(selected); // Lưu lại đối tượng Date đã chọn
    }
  };

  // xử lý khi thay đổi giờ
  const onChangeTime = (event, time) => {
    if (time) {
      setSelectedTime(time); // Cập nhật giờ đã chọn
    }
    setShowTimePicker(false); // Ẩn TimePicker sau khi chọn
  };

  // lấy tên dịch vụ theo ID
  const getServiceNames = (serviceIds) => {
    return services
      .filter((service) => serviceIds.includes(service.iddichvu))
      .map((service) => service.tendichvu);
  };

  // lấy tên trung tâm theo ID
  const getCenterNames = (centerId) => {
    try {
      if (!centerId) {
        return []; // Nếu centerId là null hoặc không phải là mảng, trả về mảng rỗng
      }
      return centers
        .filter((center) => centerId.includes(center.idtrungtam))
        .map((center) => center.tentrungtam);
    } catch (error) {
      console.error("Error confirming booking:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt lịch.");
    }
  };

  // lấy gias dịch vụ theo ID
  const getPriceId = (serviceIds) => {
    return services
      .filter((service) => serviceIds.includes(service.iddichvu))
      .map((service) => service.gia);
  };

  const calculateTotalPrice = () => {
    const selectedPrices = getPriceId(selectedServices); // Lấy giá của các dịch vụ đã chọn
    const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0); // Tính tổng
    return formatPrice(totalPrice);
  };

  //xóa một dịch vụ ra khỏi danh sách các dịch vụ đã chọn khi người dùng chọn hoặc bỏ chọn một dịch vụ CheckBox
  const toggleServiceSelection = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleCarSelect = (value) => {
    setSelectedCar(value);
    if (value === "new") {
      setIsNewCar(true); // Cho phép thêm xe mới nếu chọn 'Thêm xe mới'
    } else {
      setIsNewCar(false);
      const selected = cars.find((car) => car.idxe === value);
      setBiensoxe(selected.idxe);
      setCarBrand(selected.hangxe);
      setYearcar(selected.namsx.toString());
    }
  };

  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫"; // hoặc giá trị mặc định mà bạn muốn hiển thị khi giá trị không hợp lệ
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const Addxe = async () => {
    try {
      const response = await fetch(`${url}myapi/Xe/themxe.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idxe: idxe,
          iduser: iduser,
          hangxe: hangxe,
          namsx: namsx,
        }),
      });

      const contentType = response.headers.get("content-type");
      console.log("Content Type:", contentType); // Kiểm tra loại phản hồi

      // Kiểm tra nếu phản hồi không phải là JSON
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Lấy nội dung phản hồi dạng văn bản
        console.error("Phản hồi không phải JSON:", text);
        throw new Error("Server không trả về JSON hợp lệ.");
      }

      // Nếu phản hồi là JSON, tiếp tục xử lý
      const data = await response.json();
      if (data.success) {
        console.log("Thêm xe thành công");
      } else {
        console.error("Lỗi:", data.message);
      }
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const clearForm = () => {
    setIduser("");
    setUsername("");
    setPhoneNumber("");
    setBiensoxe("");
    setCarBrand("");
    setYearcar("");
    setCenters([]); // Nếu muốn làm sạch danh sách trung tâm
    setSelectedCenter(null); // Đặt lại trung tâm đã chọn
    setServices([]); // Nếu muốn làm sạch danh sách dịch vụ
    setSelectedServices([]); // Đặt lại danh sách dịch vụ đã chọn
    setSelectedDate(new Date()); // Đặt lại ngày đã chọn về hiện tại
    setErrorMessage("");
    setShowDatePicker(false); // Ẩn DatePicker
    setShowTimePicker(false); // Ẩn TimePicker
    setSelectedTime(new Date()); // Đặt lại giờ đã chọn về hiện tại
    setCars([]); // Nếu muốn làm sạch danh sách xe
    setSelectedCar(""); // Đặt lại xe đã chọn
    setIsNewCar(false); // Đặt lại trạng thái xe mới
  };

  // Xác nhận đặt lịch
  const confirmBooking = async () => {
    try {
      const bookingData = {
        iduser: iduser,
        idxe: selectedCar === "new" ? idxe : selectedCar,
        idtrungtam: selectedCenter,
        selectedServices: selectedServices, // Gửi danh sách dịch vụ đã chọn
        ngayhen: date.toISOString().split("T")[0], // Định dạng ngày YYYY-MM-DD
        thoigianhen: `${selectedTime.getHours()}:${selectedTime.getMinutes()}`, // Định dạng giờ
      };

      const response = await fetch(`${url}/myapi/Lichhen/taolichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (result.success) {
        clearForm();
        Alert.alert("Thành công", result.message);
        navigation.navigate("PaymentScreen");
      } else {
        Alert.alert("Lỗi", result.message);
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt lịch.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Đặt lịch bảo dưỡng ô tô</Text>

        {/* ComboBox để chọn xe */}
        <Picker
          selectedValue={selectedCar}
          onValueChange={(value) => handleCarSelect(value)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn xe" value="" />
          {cars.map((car) => (
            <Picker.Item
              key={car.idxe}
              label={car.hangxe + " - " + car.idxe}
              value={car.idxe}
            />
          ))}
          <Picker.Item label="Thêm xe mới" value="new" />
        </Picker>

        {/* Form để nhập thông tin nếu là xe mới */}
        {isNewCar && (
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Biển số xe"
              value={idxe}
              onChangeText={setBiensoxe}
            />
            <TextInput
              style={styles.input}
              placeholder="Hãng xe"
              value={hangxe}
              onChangeText={setCarBrand}
            />
            <TextInput
              style={styles.input}
              placeholder="Năm sản xuất"
              value={namsx}
              onChangeText={setYearcar}
            />
          </View>
        )}

        {/* Nút thêm xe */}
        {isNewCar && <Button title="Thêm xe" onPress={Addxe} />}

        {/* Chọn trung tâm bảo dưỡng */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Chọn trung tâm bảo dưỡng:</Text>
          <Picker
            selectedValue={selectedCenter}
            onValueChange={(itemValue) => setSelectedCenter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn trung tâm" value={null} />
            {centers.map((center) => (
              <Picker.Item
                key={center.idtrungtam}
                label={center.tentrungtam}
                value={center.idtrungtam}
              />
            ))}
          </Picker>
        </View>

        {/* Chọn dịch vụ bảo dưỡng */}
        {selectedCenter && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chọn dịch vụ:</Text>
            {services.map((service) => (
              <View key={service.iddichvu} style={styles.checkboxContainer}>
                <CheckBox
                  checked={selectedServices.includes(service.iddichvu)}
                  onPress={() => toggleServiceSelection(service.iddichvu)}
                  // onValueChange={() => toggleServiceSelection(service.iddichvu)}
                />

                <Text
                  style={styles.checkboxLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {service.tendichvu}
                </Text>
                <Text style={styles.checkboxLabel}>
                  {formatPrice(service.gia)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Chọn ngày và giờ */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Ngày đã chọn: {date.toLocaleDateString()}
          </Text>

          {/* Button để mở Date Picker */}
          <Button title="Chọn ngày" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={date} // Đảm bảo value là đối tượng Date
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={{ fontSize: 10, color: "#ff0000" }}>
            *Khung giờ từ 9:00 - 22:00
          </Text>
          <Text style={styles.label}>
            Giờ đã chọn: {selectedTime.getHours()}:{selectedTime.getMinutes()}
          </Text>
          {/* Nút để mở TimePicker */}
          <Button title="Chọn giờ" onPress={() => setShowTimePicker(true)} />

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime} // Sử dụng state cho giá trị giờ
              mode="time"
              display="spinner"
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Tóm tắt và xác nhận */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Thông tin đặt lịch:</Text>
          <Text>Tên: {username}</Text>
          <Text>Số điện thoại: {sodienthoai}</Text>
          <Text>Biển số xe: {idxe}</Text>
          <Text>Trung tâm bảo dưỡng: {getCenterNames(selectedCenter)}</Text>
          <Text>Dịch vụ: {getServiceNames(selectedServices).join(", ")}</Text>

          <Text>Ngày đã chọn: {date.toLocaleDateString()}</Text>
          <Text>
            Giờ đã chọn: {selectedTime.getHours()}:{selectedTime.getMinutes()}
          </Text>
          <Text style={{ color: "#ff0000", fontSize: 16 }}>
            Tổng tiền: {calculateTotalPrice()}
          </Text>
        </View>

        <Button title="Xác nhận đặt lịch" onPress={confirmBooking} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    width: 100,
  },
  datePicker: {
    width: "100%",
  },
  summary: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BookingScreen;
