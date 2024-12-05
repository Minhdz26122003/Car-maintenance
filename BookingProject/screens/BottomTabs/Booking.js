import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [isNewCar, setIsNewCar] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      if (selectedCenter) {
        fetchServicesByCenter(selectedCenter);
      } else {
        setServices([]);
      }
    }, [selectedCenter, iduser])
  );
  const loadUserData = async () => {
    const userData = await getUserData();
    if (userData) {
      setIduser(userData.iduser);
      loadAccount(userData.iduser);
    }
  };
  const loadData = async () => {
    await loadUserData();
    await loadCenters();
    await loadCars();
  };

  const loadAccount = async (iduser) => {
    try {
      const response = await fetch(
        `${url}/myapi/Taikhoan/gettkbyid.php?iduser=${iduser}`
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.tk) && data.tk.length > 0) {
        // Lấy username từ phần tử đầu tiên
        setUsername(data.tk[0].username);
        setPhoneNumber(data.tk[0].sodienthoai);
      } else {
        console.log(
          "Không tìm thấy tài khoản nào:",
          data.message || "Lỗi không xác định"
        );
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tài khoản:", error);
    }
  };
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
      const response = await fetch(
        `${url}/myapi/Xe/getxe.php?iduser=${iduser}`
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.xe)) {
        setCars(data.xe);
      } else {
        console.log("Không tìm thấy xe nào:", data.message);
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
      setDate(selected);
    }
  };

  // xử lý khi thay đổi giờ
  const onChangeTime = (event, time) => {
    if (time) {
      setSelectedTime(time);
    }
    setShowTimePicker(false);
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
        return [];
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
    const selectedPrices = getPriceId(selectedServices);
    const totalPrice = selectedPrices.reduce((acc, price) => acc + price, 0);
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
      setIsNewCar(true);
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
      return "0 ₫";
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
      const data = await response.json();
      if (data.success) {
        loadCars();
        // isNewCar = false;
        // Xóa dữ liệu input
        setBiensoxe("");
        setCarBrand("");
        setYearcar("");
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
    setCenters([]);
    setSelectedCenter(null);
    setServices([]);
    setSelectedServices([]);
    setSelectedDate(new Date());
    setErrorMessage("");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSelectedTime(new Date());
    setCars([]);
    setSelectedCar("");
    setIsNewCar(false);
  };

  const showToast = () => {
    Toast.show({
      type: "success", // success | error | info
      text1: "Thông báo",
      text2: "Đăng ký thành công! 🎉",

      position: "bottom",
    });
  };
  // Xác nhận đặt lịch
  const confirmBooking = async () => {
    try {
      const bookingData = {
        iduser: iduser,
        idxe: selectedCar === "new" ? idxe : selectedCar,
        idtrungtam: selectedCenter,
        selectedServices: selectedServices,
        ngayhen: date.toISOString().split("T")[0],
        thoigianhen: `${selectedTime.getHours()}:${selectedTime.getMinutes()}`,
      };

      const response = await fetch(`${url}/myapi/Lichhen/taolichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log("lichhen", result);

      if (result.success) {
        clearForm();
        // Alert.alert("Thành công", result.message);
        showToast();

        navigation.navigate(
          "ManageBookScreen"
          // idlichhen: result.data?.idlichhen,
          // username: username,
          // sodienthoai: sodienthoai,
          // idxe: selectedCar === "new" ? idxe : selectedCar,
          // selectedCenter: getCenterNames(selectedCenter),
          // selectedServices: getServiceNames(selectedServices).join(", "),
          // ngayhen: date.toLocaleDateString(),
          // thoigianhen: `${selectedTime.getHours()}:${selectedTime.getMinutes()}`,
          // tongtien: calculateTotalPrice(),
        );
      } else {
        console.error("Lỗi", result.message);
        Alert.alert("Lỗi", result.message);
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Đặt lịch bảo dưỡng</Text>

        <View>
          <Text style={styles.label}>Chọn xe </Text>
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
        </View>

        {/* Form để nhập thông tin nếu là xe mới */}
        {isNewCar && (
          <View style={styles.containeraddcar}>
            <View style={styles.groupaddcar}>
              <Text style={styles.textnewcar}>Biển số xe: </Text>
              <TextInput
                style={styles.input}
                placeholder="Biển số xe"
                value={idxe}
                onChangeText={setBiensoxe}
              />
            </View>
            <View style={styles.groupaddcar}>
              <Text style={styles.textnewcar}>Hãng xe: </Text>
              <TextInput
                style={styles.input}
                placeholder="Hãng xe"
                value={hangxe}
                onChangeText={setCarBrand}
              />
            </View>
            <View style={styles.groupaddcar}>
              <Text style={styles.textnewcar}>Năm sản xuất xe: </Text>
              <TextInput
                style={styles.input}
                placeholder="Năm sản xuất"
                value={namsx}
                onChangeText={setYearcar}
              />
            </View>
            {/* Nút thêm xe */}
            {isNewCar && (
              <TouchableOpacity
                style={styles.btnaddcar}
                title="Thêm xe"
                onPress={Addxe}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 13,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Thêm xe
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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
                  style={styles.checkboxLabeltext}
                  numberOfLines={3}
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
        <View style={styles.inputHours}>
          <Text style={styles.labelHours}>
            Ngày đã chọn: {date.toLocaleDateString()}
          </Text>

          {/* Button để mở Date Picker */}
          <TouchableOpacity
            style={styles.btnaddcar}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 13,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Chọn ngày
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.inputHours}>
          <Text style={{ fontSize: 10, color: "#ff0000" }}>
            *Khung giờ từ 9:00 - 22:00
          </Text>
          <Text style={styles.labelHours}>
            Giờ đã chọn: {selectedTime.getHours()}:{selectedTime.getMinutes()}
          </Text>
          {/* Nút để mở TimePicker */}
          <TouchableOpacity
            style={styles.btnaddcar}
            title="Chọn giờ"
            onPress={() => setShowTimePicker(true)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 13,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Chọn giờ
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="spinner"
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Tóm tắt và xác nhận */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Thông tin đặt lịch:</Text>
          <View style={styles.groupsumary}>
            <Text>Tên: </Text>
            <Text>{username}</Text>
          </View>
          <View style={styles.groupsumary}>
            <Text>Số điện thoại: </Text>
            <Text>{sodienthoai}</Text>
          </View>
          <View style={styles.groupsumary}>
            <Text>Biển số xe: </Text>
            <Text>{idxe}</Text>
          </View>
          <View style={styles.groupsumary}>
            <Text>Trung tâm bảo dưỡng: </Text>
            <Text>{getCenterNames(selectedCenter)}</Text>
          </View>
          <View style={styles.groupsumary}>
            <Text>Dịch vụ: </Text>
            <Text
              style={{ flex: 1, textAlign: "right" }}
              numberOfLines={10}
              ellipsizeMode="tail"
            >
              {getServiceNames(selectedServices).join(", ")}
            </Text>
          </View>

          <View style={styles.groupsumary}>
            <Text>Ngày đã chọn: </Text>
            <Text> {date.toLocaleDateString()}</Text>
          </View>
          <View style={styles.groupsumary}>
            <Text>Giờ đã chọn:</Text>
            <Text>
              {selectedTime.getHours()}:{selectedTime.getMinutes()}
            </Text>
          </View>

          <Text
            style={{
              color: "#ff0000",
              marginTop: 10,
              paddingTop: 5,
              fontSize: 16,
              borderTopColor: "black",
              borderTopWidth: 0.3,
            }}
          >
            Tổng tiền: {calculateTotalPrice()}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 10,
            borderRadius: 20,
          }}
          onPress={confirmBooking}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Xác nhận đặt lịch
          </Text>
        </TouchableOpacity>
        <Toast />
      </View>
    </ScrollView>
  );
};
clearImmediate;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    backgroundColor: "#f0f8ff",
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  containeraddcar: {
    marginTop: 20,
    borderColor: "#000000",
    backgroundColor: "#f0f8ff",
    borderWidth: 0.5,
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  textnewcar: {
    marginRight: 10,
  },
  groupaddcar: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnaddcar: {
    fontWeight: "bold",
    backgroundColor: "green",

    borderRadius: 10,
    width: 150,
    alignItems: "center",
    padding: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHours: {
    marginBottom: 20,
  },
  labelHours: {
    backgroundColor: "#f0f8ff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    borderColor: "red",
    padding: 10,
    borderStyle: "solid",
    borderWidth: 0.5,
  },
  input: {
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 10,
    padding: 20,
    borderStyle: "solid",
    backgroundColor: "#f0f8ff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f0f8ff",
  },
  checkboxLabel: {
    marginLeft: 50,
  },
  checkboxLabeltext: {
    marginRight: 10,
    width: 150,
  },
  datePicker: {
    width: "100%",
  },
  groupsumary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginVertical: 5,
  },
  summary: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
    borderStyle: "solid",

    backgroundColor: "#f0f8ff",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BookingScreen;
