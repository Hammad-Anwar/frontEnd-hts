import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import moment from "moment";
import { Colors } from "../../constants/theme";
import profileImg from "../../assets/profileImg.jpg";
import { showMessage } from "react-native-flash-message";

const ProposalProfiles = ({ navigation, route }) => {
  const { vendorIds, proposalType, proposalId } = route?.params;
  const vendorIdArray = vendorIds.map(({ _id }) => _id);

  const [userInfo, setUserInfo] = useState(null);

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

  const { data: vendorsData, refetch: fetchVendorsData } = useQuery({
    queryKey: ["vendorsData", vendorIds],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/user/getVendorsByIds?vendorIds=${vendorIdArray.join(",")}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  // Change Status on Direct Proposal
  const updateStatusMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/proposal/update-status`,
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
        fetchVendorsData();
        navigation.goBack();
      } else {
        showMessage({
          message: e.message || "An Error occured",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handleStatusBtn = async (vendorId, status) => {
    const data = {
      vendorId: vendorId,
      proposalId: proposalId,
      status: status,
    };
    await updateStatusMutation.mutate(data);
    // console.log("ddasd", data);
  };

  useEffect(() => {
    if (vendorIds) {
      fetchVendorsData();
    }
  }, [vendorIds]);

  const renderVendorItem = ({ item }) => (
    <View style={styles.vendorContainer}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              item?.vendor?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.img}
          resizeMode={"cover"}
        />
        <Text style={styles.vendorName}>{item.vendor.fullName}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${item.vendor.email}`)}
        >
          <Text style={styles.vendorEmail}>{item.vendor.email}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${item.vendor.mobileNo}`)}
        >
          <Text style={styles.detailText}>
            <Text style={styles.label}>Mobile: </Text>
            {item.vendor.mobileNo}
          </Text>
        </TouchableOpacity>
        <Text style={styles.detailText}>
          <Text style={styles.label}>City: </Text>
          {item.vendor.city}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Service: </Text>
          {item.service?.serivceName}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Work Experience: </Text>
          {item.workExperience} years
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Description: </Text>
          {item.workDescription}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Profile Created At: </Text>
          {moment(item.createdAt).format("MMM Do YYYY")}
        </Text>
      </View>
      {proposalType === "post" ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleStatusBtn(item?._id, "accept")}
        >
          <Text style={styles.btnText}>Accept User</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vendorsData}
        renderItem={renderVendorItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vendors available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  vendorContainer: {
    backgroundColor: Colors.primary.sub,
    borderColor: Colors.primary.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: "column",
    marginBottom: 10,
    alignItems: "center",
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
    height: 50,
    width: 50,
    borderRadius: 80,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary.darkBlack,
    marginBottom: 5,
  },
  vendorEmail: {
    fontSize: 14,
    color: Colors.primary.lightGray,
  },
  content: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 15,
    color: Colors.primary.lightBlack,
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    color: Colors.primary.darkBlack,
  },
  btn: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.primary.lightGray,
    marginTop: 20,
  },
});

export default ProposalProfiles;
