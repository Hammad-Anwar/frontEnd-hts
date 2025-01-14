import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Linking,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import logoImg from "../../assets/logo.png";

import { Colors } from "../../constants/theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import profileImg from "../../assets/profileImg.jpg";
import { showMessage } from "react-native-flash-message";

const VendorHome = () => {
  const [selectedButton, setSelectedButton] = useState("post");
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
    data: postProposal,
    refetch: fetchPostProposal,
    isLoading: postLoader,
  } = useQuery({
    queryKey: ["postProposal", userInfo?.city],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/proposal/post-vendor?city=${userInfo?.city}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  const {
    data: directProposal,
    refetch: fetchDirectProposal,
    isLoading: directLoader,
  } = useQuery({
    queryKey: ["directProposal"],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/proposal/direct-vendor`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  // Apply on Post Proposal
  const applyPostMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/proposal/apply-post-proposal`,
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
        fetchPostProposal();
      } else {
        showMessage({
          message: e.response.message || "An Error occured",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
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
        fetchDirectProposal();
      } else {
        showMessage({
          message: e.response.message || "An Error occured",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handleInterestedBtn = async (id) => {
    const data = {
      proposalId: id,
    };
    await applyPostMutation.mutate(data);
  };
  const handleStatusBtn = async (id, status) => {
    const data = {
      proposalId: id,
      status: status,
    };
    await updateStatusMutation.mutate(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (selectedButton === "post") {
        fetchPostProposal();
      } else if (selectedButton === "direct") {
        fetchDirectProposal();
      }
    }, [selectedButton, userInfo?.city])
  );

  const renderProposalItem = ({ item }) => (
    <View style={styles.proposalContainer}>
      <View style={styles.proposalHeader}>
        <Image
          source={{
            uri:
              item?.customerUser?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.img}
          resizeMode={"cover"}
        />

        <View>
          <Text style={styles.proposalTitle}>
            {item?.customerUser?.fullName}
          </Text>
          <Text style={styles.proposalTime}>
            {moment(item?.createdAt).format("MMM Do YYYY, h:mm A")}
          </Text>
        </View>
      </View>
      <Text style={styles.proposalDescription}>{item?.description}</Text>
      <Text style={styles.proposalInfoText}>
        Service:{" "}
        <Text style={[styles.boldText, { textTransform: "capitalize" }]}>
          {item?.service?.serivceName}
        </Text>
      </Text>
      <View style={styles.proposalInfoRow}>
        <Text style={styles.proposalInfoText}>
          Start Date: <Text style={styles.boldText}>{item?.startDate}</Text>
        </Text>
        <Text style={styles.proposalInfoText}>
          Start Time: <Text style={styles.boldText}>{item?.startTime}</Text>
        </Text>
      </View>
      <View style={styles.proposalInfoRow}>
        <Text style={styles.proposalInfoText}>
          Total Days: <Text style={styles.boldText}>{item?.totalDays}</Text>
        </Text>
        <Text style={styles.proposalInfoText}>
          Budget: <Text style={styles.boldText}>{item?.budget}</Text>
        </Text>
      </View>

      {/* Personal Information Section */}
      <TouchableOpacity
        onPress={() => handleToggleDetails(item?._id)}
        style={styles.infoToggle}
      >
        <Text style={styles.infoHeader}>Further Details</Text>
        <MaterialCommunityIcons
          name={
            isPersonalInfoVisible === item._id ? "chevron-up" : "chevron-down"
          }
          size={24}
          color={Colors.primary.lightBlack}
        />
      </TouchableOpacity>

      {isPersonalInfoVisible === item?._id && (
        <View style={styles.personalInfo}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`tel:${item?.customerUser?.mobileNo}`)
            }
          >
            <Text style={styles.infoText}>
              Phone: {item?.customerUser?.mobileNo}
            </Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>City: {item?.customerUser?.city}</Text>
          <TouchableOpacity
            onPress={() => {
              const address = encodeURIComponent(item?.customerUser?.address);
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${address}`
              );
            }}
          >
            <Text style={styles.infoText}>
              Address: {item?.customerUser?.address}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`mailto:${item?.customerUser?.email}`)
            }
          >
            <Text style={styles.infoText}>
              Email: {item?.customerUser?.email}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedButton === "post" ? (
        <TouchableOpacity
          style={[
            styles.btn,
            {
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            },
          ]}
          onPress={() => handleInterestedBtn(item._id)}
        >
          <MaterialIcons name="done-all" size={24} color="white" />
          <Text style={[styles.btnTxt, { fontSize: 14 }]}>Interested</Text>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            {
              marginTop: 10,
              borderTopWidth: 1,
              borderColor: Colors.primary.lightGray,
            },
          ]}
        >
          {item?.status === "waiting" ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: Colors.primary.red, width: "35%" },
                ]}
                onPress={() => handleStatusBtn(item?._id, "decline")}
              >
                <Text style={[styles.btnTxt, { fontSize: 14 }]}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: Colors.primary.green, width: "35%" },
                ]}
                onPress={() => handleStatusBtn(item?._id, "accept")}
              >
                <Text style={[styles.btnTxt, { fontSize: 14 }]}>Accept</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color:
                  item?.status === "waiting"
                    ? "orange"
                    : item?.status === "accept"
                    ? "green"
                    : "indianred",
                textTransform: "capitalize",
                textAlign: "center",
                marginTop: 5,
              }}
            >
              You {item?.status} the proposal
            </Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderColor: Colors.primary.lightGray,
            },
          ]}
        >
          <Image source={logoImg} style={styles.imgIcon} />
          <View style={[styles.row, { marginRight: 20 }]}>
            <TouchableOpacity style={{ marginRight: 10 }}>
              <MaterialCommunityIcons
                name="cart-variant"
                size={24}
                color={"#000"}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={24}
                color={"#000"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Proposal Type Selection */}
        <View style={styles.selectionButtons}>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "post" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("post")}
          >
            <Text style={styles.btnTxt}>Post Proposal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectedBtn,
              selectedButton === "direct" && {
                backgroundColor: Colors.primary.main,
              },
            ]}
            onPress={() => setSelectedButton("direct")}
          >
            <Text style={styles.btnTxt}>Direct Proposal</Text>
          </TouchableOpacity>
        </View>

        {/* Proposal List */}
        {selectedButton === "post" ? (
          <FlatList
            data={postProposal}
            refreshControl={
              <RefreshControl
                refreshing={postLoader}
                onRefresh={() => fetchPostProposal()}
              />
            }
            renderItem={renderProposalItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.proposalList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No proposals available</Text>
            }
          />
        ) : (
          <FlatList
            data={directProposal}
            refreshControl={
              <RefreshControl
                refreshing={directLoader}
                onRefresh={() => fetchDirectProposal()}
              />
            }
            renderItem={renderProposalItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.proposalList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No proposals available</Text>
            }
          />
        )}
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

export default VendorHome;
