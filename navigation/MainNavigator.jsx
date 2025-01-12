import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "./BottomNavigation";
import SignUp from "../screens/Auth/SignUp";
import Login from "../screens/Auth/Login";
import VendorDetails from "../screens/Auth/VendorDetails";
import ServiceProfileDetails from "../screens/CustomerHome/ServiceProfileDetails";
import DirectProposal from "../screens/CustomerHome/DirectProposal";
import ProposalProfiles from "../screens/CustomerHome/ProposalProfiles";
import VendorOrderDetails from "../screens/VendorHome/VendorOrder/VendorOrderDetails";
import VendorOrder from "../screens/VendorHome/VendorOrder";
import EditPassword from "../screens/Edit/EditPassword";
import EditProfile from "../screens/Edit/EditProfile";
import UpdateProposal from "../screens/CustomerHome/UpdateProposal";
import CustomerOrder from "../screens/CustomerHome/CustomerOrder";
import CustomerOrderDetails from "../screens/CustomerHome/CustomerOrder/CustomerOrderDetails";
import CreateReview from "../screens/CustomerHome/CreateReview";
import UpdateReview from "../screens/CustomerHome/UpdateReview";
import ViewReviews from "../screens/VendorHome/ViewReviews";
import ForgetPassword from "../screens/Auth/ForgetPassword";
import OtpScreen from "../screens/Auth/OtpScreen";
import ChangePassword from "../screens/Auth/ChangePassword";
import { StatusBar } from "react-native";
import { Colors } from "../constants/theme";
import Services from "../screens/CustomerHome/Services";
import Chat from "../screens/Chat";
import Dispute from "../screens/Dispute";

const Stack = createNativeStackNavigator();

function MainNavigator({ isLogin }) {
  return (
    <>
      <StatusBar backgroundColor={Colors.primary.white} barStyle="dark-content"/>

      <Stack.Navigator
        initialRouteName={isLogin ? "BottomNavigation" : "Login"}
      >
        {isLogin ? (
          <>
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ServiceProfileDetails"
              component={ServiceProfileDetails}
              options={{ title: "Service Profile Details", headerShown: true }}
            />
            <Stack.Screen
              name="DirectProposal"
              component={DirectProposal}
              options={{ title: "Send Proposal", headerShown: true }}
            />
            <Stack.Screen
              name="ProposalProfiles"
              component={ProposalProfiles}
              options={{ title: "Vendor Profile", headerShown: true }}
            />
            <Stack.Screen
              name="CustomerOrder"
              component={CustomerOrder}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CustomerOrderDetails"
              component={CustomerOrderDetails}
              options={{ title: "Order Details", headerShown: true }}
            />
            <Stack.Screen
              name="VendorOrder"
              component={VendorOrder}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VendorOrderDetails"
              component={VendorOrderDetails}
              options={{ title: "Order Details", headerShown: true }}
            />
            <Stack.Screen
              name="EditPassword"
              component={EditPassword}
              options={{ title: "Update Password", headerShown: true }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: "Update Profile", headerShown: true }}
            />
            <Stack.Screen
              name="UpdateProposal"
              component={UpdateProposal}
              options={{ title: "Update Proposal", headerShown: true }}
            />
            <Stack.Screen
              name="CreateReview"
              component={CreateReview}
              options={{ title: "Post Review", headerShown: true }}
            />
            <Stack.Screen
              name="UpdateReview"
              component={UpdateReview}
              options={{ title: "Update Review", headerShown: true }}
            />
            <Stack.Screen
              name="ViewReviews"
              component={ViewReviews}
              options={{ title: "Reviews", headerShown: true }}
            />
            <Stack.Screen
              name="Services"
              component={Services}
              options={{ title: "Services", headerShown: true }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ title: "Chat", headerShown: false }}
            />
            <Stack.Screen
              name="Dispute"
              component={Dispute}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgetPassword"
              component={ForgetPassword}
              options={{ title: "Forget Password", headerShown: true }}
            />
            <Stack.Screen
              name="OtpScreen"
              component={OtpScreen}
              options={{ title: "Otp Verify", headerShown: true }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ title: "Change Password", headerShown: true }}
            />
            <Stack.Screen
              name="Signup"
              component={SignUp}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="VendorDetails"
              component={VendorDetails}
              options={{ title: "Vendor Details" }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}

export default MainNavigator;
