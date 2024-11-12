import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./../screens/login";
import SignupScreen from "./../screens/signup";
import WellcomeScreen from "./../screens/wellcome";
import HomeScreen from "../screens/BottomTabs/Home";
import BookingScreen from "../screens/BottomTabs/Booking";
import ProfileScreen from "../screens/BottomTabs/Profile";
import CenterDetailScreen from "../screens/Detail/CenterDetail";
import ManageBookScreen from "../screens/Detail/ManageBook";
import ManageCarScreen from "../screens/Detail/ManageCar";
import EditBookScreen from "../screens/EditBook";
import ServiceDetailScreen from "../screens/Detail/ServiceDetail";
import PaymentScreen from "../screens/payments";
import ListServices from "../screens/List/ListServices";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  const { username } = route.params; // Nhận username từ điều hướng

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Booking") {
            iconName = "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ username }} // Truyền username vào HomeScreen
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator chính bao gồm các màn hình như Login, Signup và BottomTabNavigator
const Rootnavi = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WellcomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#FEAB",
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: "Signup" }}
        />
        <Stack.Screen
          name="WellcomeScreen"
          component={WellcomeScreen}
          options={{ title: "Welcome" }}
        />
        {/* Bottom Tab Navigator sẽ nằm ở trong Stack */}
        <Stack.Screen
          name="HomeTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CenterDetailScreen"
          component={CenterDetailScreen}
          options={{ title: "Center Details", headerLeft: null }}
        />
        <Stack.Screen
          name="ManageBookScreen"
          component={ManageBookScreen}
          options={{ title: "ManageBook", headerLeft: null }}
        />
        <Stack.Screen
          name="ManageCarScreen"
          component={ManageCarScreen}
          options={{ title: "ManageCar", headerLeft: null }}
        />
        <Stack.Screen
          name="EditBookScreen"
          component={EditBookScreen}
          options={{ title: "EditBook", headerLeft: null }}
        />
        <Stack.Screen
          name="ServiceDetailScreen"
          component={ServiceDetailScreen}
          options={{ title: "Service Details", headerLeft: null }}
        />
        <Stack.Screen
          name="ListServices"
          component={ListServices}
          options={{ title: "Payment Screen ", headerLeft: null }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ title: "Payment Screen ", headerLeft: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Rootnavi;
