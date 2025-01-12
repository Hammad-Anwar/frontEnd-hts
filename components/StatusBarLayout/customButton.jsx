import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function CustomBtn({
  style,
  lbl,
  onPress,
  disabled,
  lblStyle,
  loading,
  loaderColor = "black",
  bottomBtn,
}) {
  return (
    <View>
      {bottomBtn ? (
        <TouchableOpacity onPress={onPress} style={styles.outlineBtn}>
          <MaterialCommunityIcons
            name="bookshelf"
            size={34}
            color={Colors.primary.main}
          />
          <Text style={styles.outlineBtnText}>{lbl}</Text>
          <Text style={{ textAlign: "center" }}>
            Lorem Ipsum is simply dummy text of the printing.{" "}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          style={[styles.btn, style]}
        >
          {loading ? <ActivityIndicator size={24} color={loaderColor} /> : null}
          <Text
            style={[
              styles.btnText,
              lblStyle,
              loading ? { display: "none" } : null,
            ]}
          >
            {lbl}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary.main,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary.darkgray,
    textTransform: "uppercase",
  },
  outlineBtn: {
    width: 160,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: 8,
    backgroundColor: Colors.primary.white,
  },
  outlineBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary.lightBlack,
  },
});

export default CustomBtn;
