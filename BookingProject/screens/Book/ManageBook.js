import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";

const ManageBookScreen = ({ navigation }) => {
  const [lichHenList, setLichHenList] = useState([]);
  const [lichHenList1, setLichHenList1] = useState([]);
  const [lichHenList2, setLichHenList2] = useState([]);
  const [lichHenList3, setLichHenList3] = useState([]);
  const [lichHenList4, setLichHenList4] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [iduser, setIduser] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [routes] = useState([
    { key: "waitconfirm", title: "Chờ xác nhận" },
    { key: "inprogress", title: "Đang thực hiện" },
    { key: "completed", title: "Hoàn thành" },
    { key: "paymented", title: "Đã thanh toán" },
    { key: "canceled", title: "Đã hủy" },
  ]);

  const renderScene = SceneMap({
    waitconfirm: () => <TabWaitConfirm lichHenList={lichHenList} />,
    inprogress: () => <TabInProgress lichHenList1={lichHenList1} />,
    completed: () => <TabCompleted lichHenList2={lichHenList2} />,
    paymented: () => <TabPaymented lichHenList3={lichHenList3} />,
    canceled: () => <TabCanceled lichHenList4={lichHenList4} />,
  });

  // Hàm chuyển đổi trạng thái lịch hẹn
  const convertTrangThai = (trangThai) => {
    const trangThaiMap = {
      0: "Chờ xác nhận",
      1: "Đang thực hiên",
      2: "Hoàn thành",
      3: "Đã thanh toán",
      4: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return null;
    }
  };
  // Load thông tin người dùng
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );
  const loadUserData = async () => {
    const userData = await getUserData();
    if (userData) {
      setIduser(userData.iduser);
      getLichHenchuaconfirm(userData.iduser);
      getLichHendangthuchien(userData.iduser);
      getLichHenhoanthanh(userData.iduser);
      getLichHendapay(userData.iduser);
      getLichHendahuy(userData.iduser);
    }
  };
  const Huylich = async (idlichhen, lyDo) => {
    try {
      const response = await axios.post(
        `${url}myapi/Lichhen/huylichhen.php?idlichhen=${idlichhen}`,
        {
          idlichhen: idlichhen,
          lydohuy: lyDo,
        }
      );

      if (response.data.success) {
        Alert.alert("Thành công", "Lịch hẹn đã được hủy thành công.");
        getLichHenchuaconfirm(iduser);
      } else {
        Alert.alert(
          "Lỗi",
          response.data.message || "Hủy lịch không thành công."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  const getLichHenchuaconfirm = async (iduser) => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhchuaxacnhan.php?iduser=${iduser}`,
        {
          params: { iduser },
        }
      );
      if (response.data.success) {
        setLichHenList(response.data.lichhen);
      } else {
        console.log("Không có lịch hẹn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };
  const getLichHendangthuchien = async (iduser) => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhdangthuchien.php?iduser=${iduser}`,
        {
          params: { iduser },
        }
      );
      if (response.data.success) {
        setLichHenList1(response.data.lichhen);
      } else {
        console.log("Không có lịch hẹn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };
  const getLichHenhoanthanh = async (iduser) => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhhoanthanh.php?iduser=${iduser}`,
        {
          params: { iduser },
        }
      );
      if (response.data.success) {
        setLichHenList2(response.data.lichhen);
      } else {
        console.log("Không có lịch hẹn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };
  const getLichHendapay = async (iduser) => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhdathanhtoan.php?iduser=${iduser}`,
        {
          params: { iduser },
        }
      );
      if (response.data.success) {
        setLichHenList3(response.data.lichhen);
      } else {
        console.log("Không có lịch hẹn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };
  const getLichHendahuy = async (iduser) => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhdahuy.php?iduser=${iduser}`,
        {
          params: { iduser },
        }
      );
      if (response.data.success) {
        setLichHenList4(response.data.lichhen);
      } else {
        console.log("Không có lịch hẹn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    setRefreshing(false);
  };

  // Tab hiển thị chờ xác nhận
  const TabWaitConfirm = ({ lichHenList }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const openModal = (idlichhen) => {
      setSelectedId(idlichhen);
      setModalVisible(true);
    };

    const handleCancel = () => {
      if (!cancelReason.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập lý do hủy!");
        return;
      }
      setModalVisible(false);
      Huylich(selectedId, cancelReason);
      setCancelReason("");
    };

    return (
      <View style={styles.tabContainer}>
        <SafeAreaView>
          <FlatList
            vertical
            data={lichHenList}
            keyExtractor={(item) => item.idlichhen.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Biển số xe: {item.idxe}</Text>
                <Text>Dịch vụ: {item.tendichvu}</Text>
                <Text>Ngày hẹn: {item.ngayhen}</Text>
                <Text>Thời gian: {item.thoigianhen}</Text>
                <Text>Ngày tạo: {item.ngaytao}</Text>
                <Text>Trạng thái: {convertTrangThai(item.trangthai)}</Text>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => openModal(item.idlichhen)}
                >
                  <Text style={styles.textbtn}>Hủy lịch</Text>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getLichHenchuaconfirm}
              />
            }
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#555",
                }}
              >
                Không có dữ liệu
              </Text>
            )}
          />

          {/* Modal nhập lý do hủy */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nhập lý do hủy</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Lý do hủy"
                  value={cancelReason}
                  onChangeText={setCancelReason}
                />
                <TouchableOpacity style={styles.btn} onPress={handleCancel}>
                  <Text style={styles.textbtn}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "gray" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textbtn}>Hủy bỏ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    );
  };

  // Tab đang thực hiện
  const TabInProgress = ({ lichHenList1 }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            vertical
            data={lichHenList1}
            keyExtractor={(item) => item.idlichhen.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Biển số xe: {item.idxe}</Text>
                <Text>Dịch vụ: {item.tendichvu}</Text>
                <Text>Ngày hẹn: {item.ngayhen}</Text>
                <Text>Thời gian: {item.thoigianhen}</Text>
                <Text>Ngày tạo: {item.ngaytao}</Text>
                <Text>Trạng thái: {convertTrangThai(item.trangthai)}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getLichHendangthuchien}
              />
            }
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#555",
                }}
              >
                Không có dữ liệu
              </Text>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );

  // Tab hoàn thành
  const TabCompleted = ({ lichHenList2 }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            vertical
            data={lichHenList2}
            keyExtractor={(item) => item.idlichhen.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Biển số xe: {item.idxe}</Text>
                <Text>Dịch vụ: {item.tendichvu}</Text>
                <Text>Ngày hẹn: {item.ngayhen}</Text>
                <Text>Thời gian: {item.thoigianhen}</Text>
                <Text>Ngày tạo: {item.ngaytao}</Text>
                <Text>Trạng thái: {convertTrangThai(item.trangthai)}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getLichHenhoanthanh}
              />
            }
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#555",
                }}
              >
                Không có dữ liệu
              </Text>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );

  // Tab đã thanh toán
  const TabPaymented = ({ lichHenList3 }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            vertical
            data={lichHenList3}
            keyExtractor={(item) => item.idlichhen.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Biển số xe: {item.idxe}</Text>
                <Text>Dịch vụ: {item.tendichvu}</Text>
                <Text>Ngày hẹn: {item.ngayhen}</Text>
                <Text>Thời gian: {item.thoigianhen}</Text>
                <Text>Ngày tạo: {item.ngaytao}</Text>
                <Text>Trạng thái: {convertTrangThai(item.trangthai)}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getLichHendapay}
              />
            }
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#555",
                }}
              >
                Không có dữ liệu
              </Text>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );

  // Tab đã hủy
  const TabCanceled = ({ lichHenList4 }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            vertical
            data={lichHenList4}
            keyExtractor={(item) => item.idlichhen.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text>Biển số xe: {item.idxe}</Text>
                <Text>Dịch vụ: {item.tendichvu}</Text>
                <Text>Ngày hẹn: {item.ngayhen}</Text>
                <Text>Thời gian: {item.thoigianhen}</Text>
                <Text>Ngày tạo: {item.ngaytao}</Text>
                <Text>Trạng thái: {convertTrangThai(item.trangthai)}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getLichHendahuy}
              />
            }
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#555",
                }}
              >
                Không có dữ liệu
              </Text>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quản lý lịch hẹn</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        swipeEnabled={true}
        animationEnabled={true}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: "red" }}
            style={{ backgroundColor: "#708090" }}
            tabStyle={{ width: 140 }}
            labelStyle={{ fontSize: 15, color: "black" }}
            renderLabel={({ route, focused }) => (
              <View style={styles.tabItem}>
                <Text
                  style={{ color: focused ? "blue" : "gray", fontSize: 12 }}
                >
                  {route.title}
                </Text>
              </View>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 0,
    backgroundColor: "#f9f9f9",
  },
  tabItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tabContainer: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
  },
  listItem: {
    padding: 10,
    borderColor: "#000000",
    backgroundColor: "#f0f8ff",
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  btn: {
    fontWeight: "bold",
    backgroundColor: "red",
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    padding: 10,
  },
  textbtn: {
    color: "white",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
});

export default ManageBookScreen;
