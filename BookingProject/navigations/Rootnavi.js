import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "./../screens/login";
import SignupScreen from "./../screens/signup";
import WellcomeScreen from "./../screens/wellcome";
const Stack = createStackNavigator();
const Rootnavi = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        screenOptions=
        {{
          headerStyled: {
            backgoundColor: "transparent",
          },
          headerTintColor: "#FEAB",
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyled: {
            paddingLeft: 20,
          },
        }}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{ title: "Signup " }}
        />
        <Stack.Screen
          name="WellcomeScreen"
          component={WellcomeScreen}
          options={{ title: "Wellcome" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Rootnavi;
