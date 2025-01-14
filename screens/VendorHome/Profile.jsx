import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useStateValue } from "../../context/GlobalContextProvider";
import CustomModal from "../../components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileImg from "../../assets/profileImg.jpg";
import { Colors } from "../../constants/theme";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const Profile = ({ navigation }) => {
  const [{}, dispatch] = useStateValue();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isPersonalInfoVisible, setIsPersonalInfoVisible] = useState(false);
  const [isPostVisible, setIsPostVisible] = useState(false);

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

  const { data: appliedProposal, refetch: fetchAppliedProposal } = useQuery({
    queryKey: ["appliedProposal"],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/proposal/applied-post-vendor`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  const { data: averageRating, refetch: fetchAverageRating } = useQuery({
    queryKey: ["averageRating"],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/review/getAverageRating`,
      });
      return result.averageRating;
    },
    enabled: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchAppliedProposal();
      fetchAverageRating();
    }, [])
  );

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("@auth_token");
    await AsyncStorage.removeItem("@user");
    dispatch({
      type: "SET_LOGIN",
      isLogin: false,
    });
    setLogoutModalVisible(false);
  };

  const renderProposalItem = ({ item }) => (
    <View style={styles.proposalContainer}>
      <View
        style={[
          styles.proposalHeader,
          { justifyContent: "flex-start", gap: 10 },
        ]}
      >
        <Image
          source={{
            uri:
              item?.customerUser?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.smallImg}
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

      {isPersonalInfoVisible === item._id && (
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
    </View>
  );
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.largeTxt}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={26}
              color={"indianred"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri:
                userInfo?.profileImage ||
                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
            }}
            style={styles.img}
            resizeMode={"cover"}
          />

          <View>
            <Text style={styles.text}>{userInfo?.fullName}</Text>
            <Text style={styles.smallTxt}>{userInfo?.email}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("EditProfile", { userInfo })}
              >
                <Text style={styles.btnTxt}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("EditPassword")}
              >
                <Text style={styles.btnTxt}>Edit Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={[styles.selectionButtons, { justifyContent: "flex-start" }]}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  fontSize: 60,
                  fontWeight: "600",
                  color: Colors.primary.lightBlack,
                }}
              >
                {averageRating}
              </Text>
              <MaterialCommunityIcons
                name="star"
                size={40}
                color={Colors.primary.yellow}
              />
            </View>
            <Text>Average Rating</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              width: "80%",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={[
                styles.selectedBtn,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                },
              ]}
              onPress={() => navigation.navigate("ViewReviews")}
            >
              <Text style={[styles.btnTxt, { fontSize: 14 }]}>
                View Comments
              </Text>
              <MaterialIcons
                name="arrow-right"
                size={30}
                color={Colors.primary.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Proposal Type Selection */}
        <View>
          <TouchableOpacity
            style={styles.postVisibleBtn}
            onPress={() => setIsPostVisible(!isPostVisible)}
          >
            <Text style={[styles.btnTxt, { fontSize: 14 }]}>
              Applied Post Proposal
            </Text>
            <MaterialCommunityIcons
              name={isPostVisible ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.primary.white}
            />
          </TouchableOpacity>
        </View>
        {isPostVisible && (
          <FlatList
            data={appliedProposal}
            renderItem={renderProposalItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.proposalList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No applied proposals available
              </Text>
            }
          />
        )}
      </View>
      <CustomModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onAction={confirmLogout}
        action="Sign out"
        message="Are you sure you want to sign out?"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  smallImg: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
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
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary.borderColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  postVisibleBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary.darkgray,
    padding: 15,
    // paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 20,
    marginVertical: 6,
  },

  selectedBtn: {
    width: "40%",
    backgroundColor: Colors.primary.main,
    padding: 15,
    // paddingHorizontal: 15,
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
    justifyContent: "space-between",
    alignItems: "center",
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

export default Profile;
