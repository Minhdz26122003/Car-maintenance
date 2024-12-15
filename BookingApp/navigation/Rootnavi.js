import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "./../screens/Login/login";
import SignupScreen from "./../screens/Login/signup";
import WellcomeScreen from "./../screens/Login/wellcome";
import ChangePasswordScreen from "./../screens/Account/ChangePass";
import HomeScreen from "../screens/BottomTabs/Home";
import BookingScreen from "../screens/BottomTabs/Booking";
import ProfileScreen from "../screens/BottomTabs/Profile";
import CenterDetailScreen from "../screens/Center/CenterDetail";
import ManageBookScreen from "../screens/Book/ManageBook";
import ManageCarScreen from "../screens/Car/ManageCar";
import ServiceDetailScreen from "../screens/Services/ServiceDetail";
import PaymentScreen from "../screens/Payments/payments";
import ListServices from "../screens/Services/ListServices";
import InforPersonal from "../screens/Account/InforPersonal";
import ManageReviewScreen from "../screens/Review/ManageReview";
import ListCenters from "../screens/Center/ListCenter";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  const { username } = route.params;

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
        initialParams={{ username }}
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
          headerTintColor: "#000000",
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
          options={{ title: "Login", headerBackVisible: false }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: "Signup" }}
        />
        <Stack.Screen
          name="WellcomeScreen"
          component={WellcomeScreen}
          options={{ title: "Welcome", headerBackVisible: false }}
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
          options={{ title: "Center Details" }}
        />
        <Stack.Screen
          name="ManageBookScreen"
          component={ManageBookScreen}
          options={{ title: "ManageBook" }}
        />
        <Stack.Screen
          name="ManageCarScreen"
          component={ManageCarScreen}
          options={{ title: "ManageCar" }}
        />
        <Stack.Screen
          name="ListCenters"
          component={ListCenters}
          options={{ title: "List Centers " }}
        />
        <Stack.Screen
          name="ServiceDetailScreen"
          component={ServiceDetailScreen}
          options={{ title: "Service Details", headerBackVisible: true }}
        />
        <Stack.Screen
          name="ListServices"
          component={ListServices}
          options={{ title: "Payment Screen " }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{
            title: "Payment Screen ",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="InforPersonal"
          component={InforPersonal}
          options={{ title: "InforPersonal Screen " }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ title: "ChangePassword Screen " }}
        />
        <Stack.Screen
          name="ManageReviewScreen"
          component={ManageReviewScreen}
          options={{ title: "ManageReview Screen " }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Rootnavi;
