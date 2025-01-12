import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import logoImg from "../../assets/logo.png";
import { Searchbar } from "react-native-paper";
import { Colors } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import { useQuery } from "@tanstack/react-query";

const CustomerHome = () => {
  const navigation = useNavigation();
  const [servicesData, setServicesData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const service = "electrician";
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

  const fetchServices = async () => {
    const result = await apiRequest(urlType.BACKEND, {
      method: "get",
      url: `/search/service-name?serviceName=${service}`,
    });
    if (result?.status === 200) setServicesData(result.data);
  };
  const serviceId = servicesData[0]?._id;

  const { data: vendorProfileData, refetch: fetchVendorProfile } = useQuery({
    queryKey: ["vendorProfile", userInfo?.city, serviceId],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/search/user-details?serviceId=${serviceId}&city=${userInfo?.city}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  useEffect(() => {
    if (service) fetchServices();
  }, [service]);

  useEffect(() => {
    if (userInfo?.city && serviceId) {
      fetchVendorProfile();
    }
  }, [userInfo?.city, serviceId]);

  const getRandomVendors = (data, count = 4) => {
    const shuffled = data?.sort(() => 0.5 - Math.random());
    return shuffled?.slice(0, count);
  };

  const renderVendorRow = ({ item, index }) => (
    <View style={styles.rowContainer} key={`row-${index}`}>
      {item.map((vendor) => (
        <TouchableOpacity
          key={vendor._id}
          onPress={() =>
            navigation.navigate("ServiceProfileDetails", {
              vendorData: vendor,
            })
          }
          style={styles.vendorCard}
        >
          <Image
            source={{
              uri:
                vendor?.profileImage ||
                "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
            }}
            style={styles.profileImg}
            resizeMode={"contain"}
          />
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.fullName}</Text>
            <Text style={styles.vendorService}>
              {vendor?.vendorDetails?.serivceName}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const formattedVendorData = [];
  getRandomVendors(vendorProfileData)?.forEach((vendor, index) => {
    if (index % 2 === 0) formattedVendorData.push([vendor]);
    else formattedVendorData[formattedVendorData.length - 1].push(vendor);
  });

  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Image source={logoImg} style={styles.img} />
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

          <View style={{ padding: 20 }}>
            <View
              style={{
                alignItems: "flex-start",
                backgroundColor: "#165069",
                borderRadius: 12,
                padding: 10,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 42,
                  marginRight: 40,
                }}
              >
                What are you looking for today?
              </Text>
            </View>
            <Searchbar placeholder="Search" />
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", marginVertical: 20 },
              ]}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 12,
                  backgroundColor: "lightgrey",
                }}
                onPress={() =>
                  navigation.navigate("Services", { service: "technician" })
                }
              >
                <MaterialIcons name="computer" size={34} color="#165069" />
                <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                  Technician
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 12,
                  backgroundColor: "lightgrey",
                }}
                onPress={() =>
                  navigation.navigate("Services", { service: "electrician" })
                }
              >
                <MaterialIcons
                  name="electrical-services"
                  size={34}
                  color="#165069"
                />
                <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                  Electrician
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 12,
                  backgroundColor: "lightgrey",
                }}
                onPress={() =>
                  navigation.navigate("Services", { service: "repairing" })
                }
              >
                <MaterialCommunityIcons
                  name="hammer-screwdriver"
                  size={34}
                  color="#165069"
                />
                <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                  Repairing
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{ marginVertical: 10, fontSize: 22, fontWeight: "500" }}
            >
              Recomended for you
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlatList
            data={formattedVendorData}
            renderItem={renderVendorRow}
            keyExtractor={(_, index) => `row-${index}`}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.noVendorsText}>
                No recomended vendor available
              </Text>
            }
          />
        </View>
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
  img: {
    height: 80,
    width: 80,
  },
  iconStyle: {
    height: 20,
    width: 20,
  },

  flatListContent: {
    // flex: 1,
    paddingTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 30,
  },
  vendorCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,

    borderRadius: 12,
    backgroundColor: Colors.primary.sub,
    marginHorizontal: 5,
  },
  profileImg: {
    backgroundColor: Colors.primary.sub,
    height: 100,
    width: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  vendorInfo: {
    alignItems: "center",
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary.lightBlack,
    textTransform: "capitalize",
  },
  vendorService: {
    fontSize: 14,
    color: Colors.primary.lightGray,
    textTransform: "capitalize",
  },
  noVendorsText: {
    textAlign: "center",
    color: Colors.primary.lightGray,
    fontSize: 16,
    marginTop: 20,
  },
});

export default CustomerHome;
