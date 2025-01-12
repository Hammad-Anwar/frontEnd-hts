import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants/theme';


const Dropdown = ({ options, selectedValue, onValueChange, defaultValue, inputStyle }) => {
  return (
    <View style={[styles.input, inputStyle]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
         <Picker.Item label={defaultValue} value="" color={Colors.primary.darkgray}/>
        {options.map((option) => (
          <Picker.Item label={option.label} value={option.value} key={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: Colors.primary.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: Colors.primary.sub,
    justifyContent: 'center',   
  },
  picker: {
    width: '100%',
    height: '100%',
  },
});

export default Dropdown;
