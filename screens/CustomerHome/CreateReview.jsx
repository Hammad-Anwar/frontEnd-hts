import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import { showMessage } from "react-native-flash-message";
import { Colors } from "../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CreateReview = ({ navigation, route }) => {
  const { orderId, vendorId } = route?.params;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const postReviewMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/review`,
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        showMessage({
          message: e.message,
          type: "success",
          floating: true,
        });
        setComment("");
        setRating(0);
        navigation.goBack();
      } else {
        showMessage({
          message: e.message || "An Error occurred",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handlePost = async () => {
    if (comment.length > 0 && rating > 0) {
      const data = {
        vendorUser: vendorId,
        orderDetail: orderId,
        comment: comment,
        rating: Number(rating),
      };
      await postReviewMutation.mutate(data);
    } else {
      showMessage({
        message: "Please fill all the fields",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <MaterialCommunityIcons
          name={star <= rating ? "star" : "star-outline"}
          size={32}
          color={
            star <= rating ? Colors.primary.yellow : Colors.primary.lightGray
          }
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
          color: "#333",
        }}
      >
        Rate your experience:
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {renderStars()}
      </View>

      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        placeholder="Write your comment here..."
        onChangeText={setComment}
        value={comment}
        keyboardType="default"
        placeholderTextColor={Colors.primary.lightGray}
        multiline={true}
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.button, { marginTop: 10 }]}
        onPress={handlePost}
      >
        <Text style={styles.buttonText}>Post Review</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateReview;
