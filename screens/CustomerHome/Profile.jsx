import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomModal from "../../components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileImg from "../../assets/profileImg.jpg";
import { Colors } from "../../constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import moment from "moment";
import { useStateValue } from "../../context/GlobalContextProvider";

const Profile = ({ navigation }) => {
  const [{}, dispatch] = useStateValue();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedButton, setSelectedButton] = useState("post");

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
    data: proposalData,
    refetch: fetchProposalData,
    isLoading: loadData,
  } = useQuery({
    queryKey: ["proposalData", selectedButton],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/proposal/customer?proposalType=${selectedButton}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  useEffect(() => {
    if (selectedButton) {
      fetchProposalData();
    }
  }, [selectedButton]);

  const handleLogout = async () => {
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
      <View style={styles.proposalHeader}>
        <View>
          <Text style={styles.proposalTitle}>
            {selectedButton === "post" ? "Post Proposal" : "Direct Proposal"}
          </Text>
          <Text style={styles.proposalTime}>
            {moment(item.createdAt).format("MMM Do YYYY, h:mm A")}
          </Text>
        </View>
        
        {item?.status === "accept" ? null : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UpdateProposal", { proposalDetails: item })
            }
          >
            <MaterialCommunityIcons name="pen" size={20} color={"#000"} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.proposalDescription}>{item.description}</Text>
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
      {selectedButton === "post" ? (
        <TouchableOpacity
          style={[
            styles.btn,
            {
              marginTop: 10,
              backgroundColor:
                item?.status === "accept"
                  ? Colors.primary.green
                  : Colors.primary.main,
            },
          ]}
          disabled={item?.vendor.length === 0 || item?.status === "accept"}
          onPress={() =>
            navigation.navigate("ProposalProfiles", {
              vendorIds: item?.vendor,
              proposalType: item?.proposalType,
              proposalId: item?._id,
            })
          }
        >
          <Text style={styles.btnTxt}>
            {item?.status === "accept"
              ? "You accept the proposal"
              : `View Accepted Profiles (${item?.vendor.length})`}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.proposalHeader, { marginTop: 10 }]}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color:
                item?.status === "waiting"
                  ? "orange"
                  : item?.status === "accept"
                  ? "green"
                  : "indianred",
              textTransform: "capitalize",
            }}
          >
            {item?.status}
          </Text>
          <TouchableOpacity
            style={[
              styles.btn,
              { flexDirection: "row", gap: 10, alignItems: "center" },
            ]}
            onPress={() =>
              navigation.navigate("ProposalProfiles", {
                vendorIds: item?.vendor,
                proposalType: item?.proposalType,
              })
            }
          >
            <MaterialCommunityIcons name="account" size={18} color={"#fff"} />
            <Text style={styles.btnTxt}>Profile</Text>
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
            // source={profileImg}
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
        <FlatList
          data={proposalData}
          refreshControl={
            <RefreshControl
              refreshing={loadData}
              onRefresh={() => fetchProposalData()}
            />
          }
          renderItem={renderProposalItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.proposalList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No proposals available</Text>
          }
        />
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
    justifyContent: "flex-start",
    gap: 20,
    marginTop: 20,
    borderTopWidth: 1,
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
});

export default Profile;
