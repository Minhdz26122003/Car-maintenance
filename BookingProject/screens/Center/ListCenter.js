import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "D:/Documents/ReactJS/DoAn4/BookingProject/ipconfig.js";
import { ScrollView } from "react-native-gesture-handler";

const ListCenters = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // Danh sách tất cả các trung tâm
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm
  const [Center, setCenter] = useState([]); // Danh sách trung tâm sau khi lọc

  useEffect(() => {
    fetchCenter(); // Lấy danh sách trung tâm khi component mount
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData((prevData) => [...prevData, `Item ${prevData.length + 1}`]);
      setRefreshing(false);
    }, 1000);
  };

  const Filters = () => {
    if (searchText === "") {
      alert("Nhập từ khóa muốn tìm kiếm");
      return;
    }
    searchCenters(searchText); // Gọi hàm tìm kiếm với từ khóa đã nhập
  };

  const searchCenters = async (tentrungtam) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}myapi/Trungtam/tktrungtam.php?tentrungtam=${tentrungtam}`
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        setCenter(data.centers);
      } else {
        setCenter([]);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenter = async () => {
    try {
      const response = await fetch(`${url}myapi/Trungtam/getTT.php`);
      const data = await response.json();
      setData(data);
      if (Array.isArray(data)) {
        setCenter(data);
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Danh sách Trung tâm</Text>
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text>Tìm kiếm:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập từ khóa"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={Filters}>
          <Text style={styles.applyButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={Center}
          vertical
          keyExtractor={(item) => item.idtrungtam.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.idtrungtam}
              style={styles.centerItem}
              onPress={() =>
                navigation.navigate("CenterDetailScreen", { item })
              }
            >
              <Image
                style={styles.image}
                source={{ uri: item.hinhanh }}
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.serviceTitle}>{item.tentrungtam}</Text>
                <Text style={styles.serviceText}>Địa chỉ: {item.diachi}</Text>
                <Text style={styles.serviceText}>Email: {item.email}</Text>
                <Text style={styles.serviceText}>
                  Số điện thoại: {item.sodienthoai}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,

    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    alignSelf: "center",
  },
  centerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  filterContainer: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  applyButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ListCenters;
