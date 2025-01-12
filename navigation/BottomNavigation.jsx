import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { Colors } from "../constants/theme";
// import HomeScreen from "./home";
// import ProfilePage from "./profile";
import { StatusBar } from "react-native";
import StatusBarLayout from "../components/StatusBarLayout";
// import HomeScreen from "../registration/home";
import Services from "../registration/Services";
import ServicesNavigator from "../registration/ServicesNavigator";
import { useStateValue } from "../context/GlobalContextProvider";
import ProfileCustomer from "../screens/CustomerHome/Profile";
import Profile from "../screens/VendorHome/Profile";
import Search from "../screens/CustomerHome/Search";
import VendorHome from "../screens/VendorHome";
import CustomerHome from "../screens/CustomerHome";
import PostProposal from "../screens/CustomerHome/PostProposal";
import VendorOrder from "../screens/VendorHome/VendorOrder";
import CustomerOrder from "../screens/CustomerHome/CustomerOrder";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  const [{ isType }] = useStateValue();
  console.log("ISTYPE>: ", isType);
  return (
    <>
      <StatusBar backgroundColor={Colors.primary.white} />
      {isType === "vendor" ? (
        <Tab.Navigator
          initialRouteName="VendorHome"
          screenOptions={{
            tabBarActiveTintColor: "#0C2D57",
            tabBarInactiveTintColor: "#0C2D57",
          }}
        >
          <Tab.Screen
            name="VendorHome"
            // component={Home}
            options={{
              headerShown: false,
              tabBarLabel: "Home",
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={focused ? "home" : "home-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          >
            {() => (
              <StatusBarLayout statusBarColor={Colors.primary.white}>
                <VendorHome />
              </StatusBarLayout>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="orders"
            component={VendorOrder}
            options={{
              title: "Orders",
              headerShown: true,
              tabBarLabel: "Orders",
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={
                    focused
                      ? "clipboard-check-multiple"
                      : "clipboard-check-multiple-outline"
                  }
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarLabel: "User",
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={focused ? "account" : "account-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : isType === "customer" ? (
        <Tab.Navigator
          initialRouteName="CustomerHome"
          screenOptions={{
            tabBarActiveTintColor: "#0C2D57",
            tabBarInactiveTintColor: "#0C2D57",
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={focused ? "home" : "home-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          >
            {() => (
              <StatusBarLayout statusBarColor={Colors.primary.white}>
                <CustomerHome />
              </StatusBarLayout>
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              headerShown: true,
              tabBarLabel: "Search",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "search-sharp" : "search-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="PostProposal"
            component={PostProposal}
            options={{
              title: "Post Proposal",
              headerShown: true,
              tabBarLabel: "Post Proposal",
              tabBarIcon: ({ focused, color, size }) => (
                <AntDesign
                  name={focused ? "pluscircle" : "pluscircleo"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tab.Screen
            name="orders"
            component={CustomerOrder}
            options={{
              title: "Orders",
              headerShown: true,
              tabBarLabel: "Orders",
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={
                    focused
                      ? "clipboard-check-multiple"
                      : "clipboard-check-multiple-outline"
                  }
                  color={color}
                  size={size}
                />
              ),
            }}
          >
            {/* {() => (
              <StatusBarLayout statusBarColor={Colors.primary.white}>
                <ServicesNavigator />
              </StatusBarLayout>
            )} */}
          </Tab.Screen>

          <Tab.Screen
            name="Profile"
            component={ProfileCustomer}
            options={{
              headerShown: false,
              tabBarLabel: "User",
              tabBarIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  name={focused ? "account" : "account-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : null}
    </>
  );
}

export default BottomNavigation;
