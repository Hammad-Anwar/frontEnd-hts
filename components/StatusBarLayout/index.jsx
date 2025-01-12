import React from "react";
import { StatusBar, View } from "react-native";

const StatusBarLayout = ({ children, statusBarColor, barStyle="dark-content" }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      {children}
    </View>
  );
};

export default StatusBarLayout;
