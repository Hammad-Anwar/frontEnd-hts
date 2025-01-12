import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StatusBar,
  TextInput,
} from "react-native";
import { Colors } from "../constants/theme";

const CancelModal = ({ visible, onClose, onAction, action, message, reason, setReason }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <StatusBar translucent={false} backgroundColor="rgba(0, 0, 0, 0)" />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.txt}>{message}</Text>
          <TextInput
            style={[styles.input, {textAlignVertical: "top" }]}
            placeholder="Give reason here!"
            onChangeText={setReason}
            value={reason}
            keyboardType="default"
            placeholderTextColor={Colors.primary.lightGray}
            multiline={true}
            numberOfLines={3}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 20,
            }}
          >
            <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
              <Text style={[styles.btnTxt, { color: "#fff" }]}>{action}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnTxt}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#EEEDEB",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  txt: {
    color: "#000",
    fontSize: 18,
  },
  actionBtn: {
    backgroundColor: Colors.primary.red,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  cancelBtn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  btnTxt: {
    color: "#000",
    fontSize: 16,
  },
  input: {
    marginTop: 10,
    height: 100,
    borderColor: Colors.primary.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.primary.white,
    color: Colors.primary.black,
    fontSize: 14
},
});

export default CancelModal;
