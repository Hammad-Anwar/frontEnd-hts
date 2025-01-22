import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
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
import CancelModal from "../../../components/CancelModal";
import { ScrollView } from "react-native";

const VendorOrderDetails = ({ navigation, route }) => {
  const { orderDetails } = route?.params;
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [isDisputeModalVisbile, setDisputeModalVisbile] = useState(false);

  const { data: reviewByOrder, refetch: fetchreviewByOrder } = useQuery({
    queryKey: ["reviewByOrder", orderDetails?._id],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/review/getByOrderId?orderId=${orderDetails?._id}`,
      });
      return result?.status === 200 ? result.data : null;
    },
    enabled: orderDetails?.status === "complete",
  });

  const { data: disputeCreatorData } = useQuery({
    queryKey: ["disputeCreator", orderDetails?._id],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/getCreatorDispute/${orderDetails?._id}`,
      });
      return result?.status === 200 ? result.data : null;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (orderDetails?.status === "complete") {
        fetchreviewByOrder();
      }
    }, [orderDetails?._id, orderDetails?.status])
  );

  // Change Status on Direct Proposal
  const updateStatusMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/order/updateStatus`,
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        setCancelModalVisible(false);
        showMessage({
          message: e.message,
          type: "success",
          floating: true,
        });
        setReason("");
        navigation.goBack();
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

  const chatInitializedMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/chat/${orderId}`,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        console.log("Check", e.message);
        navigation.navigate("Chat", {
          orderId: orderDetails?._id,
          loginUserId: orderDetails?.vendorUser?.vendor?._id,
          otherUser: {
            fullName: orderDetails?.customerUser?.fullName,
            profileImage: orderDetails?.customerUser?.profileImage,
          },
        });
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

  const disputeStatusMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/dispute`,
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        console.log("Check", e.message);
        setDisputeModalVisbile(false);
        showMessage({
          message: e.message,
          type: "success",
          floating: true,
        });
        setReason("");
        navigation.goBack();
      }
    },
  });

  const handleDisputeBtn = async () => {
    const data = {
      orderId: orderDetails?._id,
      reason: reason,
    };
    await disputeStatusMutation.mutate(data);
  };

  const handleStatusBtn = async (status) => {
    if (status === "cancel") {
      const data = {
        orderId: orderDetails?._id,
        status: status,
        reason: reason,
      };
      await updateStatusMutation.mutate(data);
    }
  };

  const handleChatBtn = async () => {
    if (orderDetails?.chatInitialized) {
      navigation.navigate("Chat", {
        orderId: orderDetails?._id,
        loginUserId: orderDetails?.vendorUser?.vendor?._id,
        otherUser: {
          fullName: orderDetails?.customerUser?.fullName,
          profileImage: orderDetails?.customerUser?.profileImage,
        },
      });
      console.log("Order true");
    } else {
      await chatInitializedMutation.mutate(orderDetails?._id);
      console.log("Order False");
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.proposalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={styles.proposalHeader}>
              <Image
                source={{
                  uri:
                    orderDetails?.customerUser?.profileImage ||
                    "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
                }}
                style={styles.img}
                resizeMode={"cover"}
              />

              <View>
                <Text style={styles.proposalTitle}>
                  {orderDetails?.customerUser?.fullName}
                </Text>
                <Text style={styles.proposalTime}>
                  {moment(orderDetails?.createdAt).format(
                    "MMM Do YYYY, h:mm A"
                  )}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBtn,
                {
                  backgroundColor:
                    orderDetails?.status === "working"
                      ? "orange"
                      : orderDetails?.status === "complete"
                      ? "green"
                      : orderDetails?.status === "cancel"
                      ? "red"
                      : "blue",
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "500",
                  color: Colors.primary.white,
                  textTransform: "capitalize",
                }}
              >
                {orderDetails?.status}
              </Text>
            </View>
          </View>
          <Text style={styles.proposalDescription}>
            {orderDetails?.proposalDetails?.description}
          </Text>
          <Text style={styles.proposalInfoText}>
            Service:{" "}
            <Text style={[styles.boldText, { textTransform: "capitalize" }]}>
              {orderDetails?.proposalDetails?.service?.serivceName}
            </Text>
          </Text>
          <View style={styles.proposalInfoRow}>
            <Text style={styles.proposalInfoText}>
              Start Date:{" "}
              <Text style={styles.boldText}>
                {orderDetails?.proposalDetails?.startDate}
              </Text>
            </Text>
            <Text style={styles.proposalInfoText}>
              Start Time:{" "}
              <Text style={styles.boldText}>
                {orderDetails?.proposalDetails?.startTime}
              </Text>
            </Text>
          </View>
          <View style={styles.proposalInfoRow}>
            <Text style={styles.proposalInfoText}>
              Total Days:{" "}
              <Text style={styles.boldText}>
                {orderDetails?.proposalDetails?.totalDays}
              </Text>
            </Text>
            <Text style={styles.proposalInfoText}>
              Budget:{" "}
              <Text style={styles.boldText}>
                {orderDetails?.proposalDetails?.budget}
              </Text>
            </Text>
          </View>

          <View style={styles.personalInfo}>
            <Text
              style={[styles.infoText, { fontSize: 18, textAlign: "center" }]}
            >
              Customer User Details
            </Text>
            <Text style={styles.infoText}>
              Phone: {orderDetails?.customerUser?.mobileNo}
            </Text>
            <Text style={styles.infoText}>
              City: {orderDetails?.customerUser?.city}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const address = encodeURIComponent(
                  orderDetails?.customerUser?.address
                );
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${address}`
                );
              }}
            >
              <Text style={styles.infoText}>
                Address:
                {orderDetails?.customerUser?.address}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`mailto:${orderDetails?.customerUser?.email}`)
              }
            >
              <Text style={styles.infoText}>
                Email: {orderDetails?.customerUser?.email}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                Linking.openURL(`tel:${orderDetails?.customerUser?.mobileNo}`)
              }
            >
              <MaterialCommunityIcons name={"phone"} color={"#fff"} size={22} />
              <Text style={styles.btnTxt}>Call user</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleChatBtn}>
              <MaterialCommunityIcons
                name={"chat-processing"}
                color={"#fff"}
                size={22}
              />
              <Text style={styles.btnTxt}>Chat</Text>
            </TouchableOpacity>

            {orderDetails?.status ===
            "complete" ? null : orderDetails?.status === "cancel" ||
              orderDetails?.status === "disputed" ? (
              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  navigation.navigate("Dispute", {
                    orderId: orderDetails?._id,
                    status: disputeCreatorData?.status,
                    loginUserId: orderDetails?.vendorUser?.vendor?._id,
                  })
                }
              >
                <MaterialCommunityIcons
                  name={"alert-circle"}
                  color={"#fff"}
                  size={22}
                />
                <Text style={styles.btnTxt}>Disputed</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: Colors.primary.red }]}
                  onPress={() => setCancelModalVisible(true)}
                >
                  <MaterialCommunityIcons
                    name={"cancel"}
                    color={"#fff"}
                    size={22}
                  />
                  <Text style={styles.btnTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setDisputeModalVisbile(true)}
                >
                  <MaterialCommunityIcons
                    name={"clipboard-check-multiple"}
                    color={"#fff"}
                    size={22}
                  />
                  <Text style={styles.btnTxt}>Disputed</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {orderDetails?.status === "cancel" ||
          orderDetails?.status === "disputed" ? (
            <>
              <View style={styles.reviewContainer}>
                <Text style={{ textTransform: 'capitalize', fontSize: 16, fontWeight: "500" }}>
                  {orderDetails?.status} Reason
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.primary.sub,
                    padding: 10,
                    borderColor: Colors.primary.borderColor,
                    borderWidth: 1,
                    borderRadius: 8,
                    marginTop: 5,
                  }}
                >
                  <Text> {orderDetails?.reason}</Text>
                </View>
              </View>
              {orderDetails?.status === "disputed" ? (
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    Dispute Creator:{" "}
                    {disputeCreatorData?.disputeCreator?.fullName} (
                    {disputeCreatorData?.disputeCreator?.userType})
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}

          {orderDetails?.status === "complete" ? (
            <View style={styles.reviewContainer}>
              {reviewByOrder ? (
                <>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      Review
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: Colors.primary.sub,
                      padding: 10,
                      borderColor: Colors.primary.borderColor,
                      borderWidth: 1,
                      borderRadius: 8,
                      marginTop: 5,
                    }}
                  >
                    <Text>
                      Rating: {reviewByOrder?.rating}
                      <MaterialCommunityIcons
                        name={"star"}
                        size={16}
                        color={Colors.primary.yellow}
                      />
                    </Text>

                    <Text>Comment: {reviewByOrder?.comment}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.reviewTxt}>
                  The customer hasn't provided a review yet.
                </Text>
              )}
            </View>
          ) : null}
        </ScrollView>
      </View>
      <CancelModal
        visible={isCancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        reason={reason}
        setReason={setReason}
        onAction={() => handleStatusBtn("cancel")}
        action="Yes"
        message="Are you sure you want to cancel this order?"
      />
      <CancelModal
        visible={isDisputeModalVisbile}
        onClose={() => setDisputeModalVisbile(false)}
        reason={reason}
        setReason={setReason}
        onAction={() => handleDisputeBtn()}
        action="Yes"
        message="Are you sure you want to dispute this order?"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "600",
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
    marginVertical: 15,
  },
  infoText: {
    fontSize: 16,
    color: Colors.primary.lightBlack,
    marginVertical: 5,
    fontWeight: "500",
  },
  statusBtn: {
    width: "23%",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "red",
  },
  reviewContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: Colors.primary.borderColor,
    paddingTop: 10,
  },
  reviewTxt: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: Colors.primary.lightGray,
  },
});

export default VendorOrderDetails;
