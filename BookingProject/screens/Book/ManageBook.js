import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ManageBookScreen = ({ navigation }) => {
  const [lichHenList, setLichHenList] = useState([]);
  const [lichHenList1, setLichHenList1] = useState([]);
  const [lichHenList2, setLichHenList2] = useState([]);
  const [lichHenList3, setLichHenList3] = useState([]);
  const [lichHenList4, setLichHenList4] = useState([]);
  const [lichHenList5, setLichHenList5] = useState([]);
  const [iduser, setIduser] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [routes] = useState([
    { key: "waitconfirm", title: "Chờ xác nhận" },
    { key: "inprogress", title: "Đang thực hiện" },
    { key: "completed", title: "Hoàn thành" },
    { key: "paymented", title: "Đã thanh toán" },
    { key: "canceled", title: "Hoàn thành" },
  ]);

  const renderScene = SceneMap({
    waitconfirm: () => <TabWaitConfirm lichHenList={lichHenList} />,
    inprogress: () => <TabInProgress title="Đang thực hiên" />,
    completed: () => <TabCompleted title="Hoàn thành" />,
    paymented: () => <TabPlaceholder title="Đã thanh toán" />,
    canceled: () => <TabCanceled title="Đã hủy" />,
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
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIduser(userData.iduser);
        getLichHenchuaconfirm(userData.iduser);
      }
    };
    loadUserData();
  }, []);

  const getLichHenchuaconfirm = async (iduser) => {
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
  };
  const getLichHendangthuchien = async (iduser) => {
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/getLhchuathanhtoan.php?iduser=${iduser}`,
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
  };
  const getLichHenhoanthanh = async (iduser) => {
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
  };
  const getLichHendapay = async (iduser) => {
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
  };
  const getLichHendahuy = async (iduser) => {
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
  };

  // Tab hiển thị chờ xác nhận
  const TabWaitConfirm = ({ lichHenList }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
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
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.textbtn}>Hủy lịch</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );

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
          />
        )}
      </SafeAreaView>
    </View>
  );

  const TabPlaceholder = ({ tittle }) => (
    <View style={styles.tabContainer}>
      <SafeAreaView>
        <Text>tittle</Text>
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
    flexDirection: "column", // Icon và text xếp dọc
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
});

export default ManageBookScreen;