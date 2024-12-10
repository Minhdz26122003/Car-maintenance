import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../ipconfig";

const ListServices = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [searchText, setSearchText] = useState("");

  const [Services, setService] = useState([]);
  useEffect(() => {
    fetchServices();
  }, [priceRange, searchText]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData((prevData) => [...prevData, `Item ${prevData.length + 1}`]);
      setRefreshing(false);
    }, 1000);
  };
  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const Filters = () => {
    if (priceRange.min > priceRange.max) {
      alert("Giá tối thiểu không thể lớn hơn giá tối đa.");
      return;
    }
    searchServices();
  };

  const searchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}myapi/Dichvu/tktheogia.php?keyword=${searchText}&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setService(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${url}myapi/Dichvu/getDV.php`);

      const data = await response.json();
      setData(data);
      if (Array.isArray(data)) {
        setService(data); //
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Danh sách Dịch vụ</Text>
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text>Giá từ:</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu"
            keyboardType="numeric"
            onChangeText={(value) =>
              setPriceRange({ ...priceRange, min: Number(value) })
            }
          />
          <Text>đến:</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối đa"
            keyboardType="numeric"
            onChangeText={(value) =>
              setPriceRange({ ...priceRange, max: Number(value) })
            }
          />
        </View>

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
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          vertical
          data={Services}
          keyExtractor={(item) => item.iddichvu.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.iddichvu}
              style={styles.serviceItem}
              onPress={() =>
                navigation.navigate("ServiceDetailScreen", { item })
              }
            >
              <Image
                style={styles.image}
                source={{ uri: item.hinhanh }}
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.serviceTitle}>{item.tendichvu}</Text>

                <Text style={styles.serviceText}>
                  Giá: {formatPrice(item.gia)} VNĐ
                </Text>
                <Text style={styles.serviceText}>
                  Thời gian thực hiện: {item.thoigianth}
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
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    alignSelf: "center",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
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
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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

export default ListServices;
