import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import logoImg from "../../../assets/logo.png";

import { Colors } from "../../../constants/theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "../../../api/apiRequest";
import urlType from "../../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import profileImg from "../../../assets/profileImg.jpg";
import { showMessage } from "react-native-flash-message";

const CustomerOrder = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState("working");
  const [userInfo, setUserInfo] = useState(null);
  const [isPersonalInfoVisible, setIsPersonalInfoVisible] = useState(false);

  const handleToggleDetails = (itemId) => {
    setIsPersonalInfoVisible(isPersonalInfoVisible === itemId ? null : itemId);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userString = await AsyncStorage.getItem("@user");
        const user = await JSON.parse(userString);
        if (user) {
          setUserInfo(user);
        }
      };
      fetchData();
      return () => {};
    }, [])
  );
  const {
    data: ordersByStatus,
    refetch: fetchOrdersByStatus,
    isLoading: loadData,
  } = useQuery({
    queryKey: ["ordersByStatus", selectedButton],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/orders/getByStatus?status=${selectedButton}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchOrdersByStatus();
    }, [selectedButton])
  );

  const renderProposalItem = ({ item }) => (
    <View style={styles.proposalContainer}>
      <View style={styles.proposalHeader}>
        <Image
          source={{
            uri:
              item?.vendorUser?.vendor?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.img}
          resizeMode={"cover"}
        />

        <View>
          <Text style={styles.proposalTitle}>
            {item?.vendorUser?.vendor?.fullName}
          </Text>
          <Text style={styles.proposalTime}>
            {moment(item?.createdAt).format("MMM Do YYYY, h:mm A")}
          </Text>
        </View>
      </View>
      <Text style={styles.proposalDescription}>
        {item?.proposalDetails?.description}
      </Text>
      <Text style={styles.proposalInfoText}>
        Service:{" "}
        <Text style={[styles.boldText, { textTransform: "capitalize" }]}>
          {item?.vendorUser?.service?.serivceName}
        </Text>
      </Text>
      <View style={styles.proposalInfoRow}>
        <Text style={styles.proposalInfoText}>
          Start Date:{" "}
          <Text style={styles.boldText}>
            {item?.proposalDetails?.startDate}
          </Text>
        </Text>
        <Text style={styles.proposalInfoText}>
          Start Time:{" "}
          <Text style={styles.boldText}>
            {item?.proposalDetails?.startTime}
          </Text>
        </Text>
      </View>
      <View style={styles.proposalInfoRow}>
        <Text style={styles.proposalInfoText}>
          Total Days:{" "}
          <Text style={styles.boldText}>
            {item?.proposalDetails?.totalDays}
          </Text>
        </Text>
        <Text style={styles.proposalInfoText}>
          Budget:{" "}
          <Text style={styles.boldText}>{item?.proposalDetails?.budget}</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          navigation.navigate("CustomerOrderDetails", { orderDetails: item });
        }}
      >
        <Text style={styles.btnTxt}>View More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Proposal Type Selection */}
        <View style={styles.selectionButtons}>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "working" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("working")}
          >
            <Text style={styles.btnTxt}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "complete" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("complete")}
          >
            <Text style={styles.btnTxt}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "cancel" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("cancel")}
          >
            <Text style={styles.btnTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "disputed" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("disputed")}
          >
            <Text style={styles.btnTxt}>Disputed</Text>
          </TouchableOpacity>
        </View>

        {/* Proposal List */}

        <FlatList
          data={ordersByStatus}
          refreshControl={
            <RefreshControl
              refreshing={loadData}
              onRefresh={() => fetchOrdersByStatus()}
            />
          }
          renderItem={renderProposalItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.proposalList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No order available</Text>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgIcon: {
    height: 60,
    width: 80,
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.primary.borderColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  largeTxt: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  profileInfo: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "capitalize",
    marginTop: 10,
  },
  smallTxt: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  Icon: {
    height: 120,
    width: 120,
    borderRadius: 80,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    backgroundColor: Colors.primary.main,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 6,
  },
  btnTxt: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textTransform: "capitalize",
    textAlign: "center",
  },
  selectionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.primary.borderColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  selectedBtn: {
    backgroundColor: Colors.primary.darkgray,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 6,
  },
  proposalList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  proposalContainer: {
    padding: 10,
    backgroundColor: Colors.primary.sub,
    borderColor: Colors.primary.borderColor,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
  },
  proposalHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  proposalTitle: {
    fontSize: 18,
    color: Colors.primary.lightBlack,
    fontWeight: "500",
  },
  proposalTime: {
    fontSize: 12,
    color: Colors.primary.lightBlack,
  },
  proposalDescription: {
    marginVertical: 10,
    fontSize: 16,
  },
  proposalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  proposalInfoText: {
    fontSize: 15,
  },
  boldText: {
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.primary.lightGray,
    marginTop: 20,
  },
  infoToggle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary.black,
  },
  personalInfo: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,

    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: Colors.primary.lightBlack,
    marginVertical: 5,
    fontWeight: "500",
  },
});

export default CustomerOrder;
