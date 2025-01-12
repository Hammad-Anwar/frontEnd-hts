import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceUser from "./ServiceUser";
import Services from "./Services";

function ServicesNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Services">
      <Stack.Screen
        name="ServiceUser"
        component={ServiceUser}
        options={{ headershown: false }}
        // options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name="Services"
        component={Services}
        options={{ headershown: false }}
        // options={{ title: 'Sign Up' }}
      />
    </Stack.Navigator>
  );
}

export default ServicesNavigator;
