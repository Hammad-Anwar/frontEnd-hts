import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/theme';


const CustomSearchInput = ({
  placeholder = "Search",
  iconName = "search",
  iconSize = 26,
  iconColor = "#555",
  containerStyle,
  inputStyle,
  iconStyle,
  value,
  onChangeText,
  onIconPress,
}) => {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <TextInput
        style={[styles.searchInput, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.primary.black}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={[styles.iconContainer, iconStyle]} onPress={onIconPress}>
        <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: Colors.primary.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.primary.sub,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    color: Colors.primary.black,
  },
  iconContainer: {
    padding: 10,
  },
});

export default CustomSearchInput;
