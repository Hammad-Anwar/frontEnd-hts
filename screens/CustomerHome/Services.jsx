import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Dropdown from "../../components/Dropdown";
import { citiesName } from "../../constants/helper";
import { Colors } from "../../constants/theme";
import CustomSearchInput from "../../components/CustomSearchInput";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import profileImg from "../../assets/profileImg.jpg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Services = ({ route }) => {
  const navigation = useNavigation();
  const { service } = route?.params;
  const [servicesData, setServicesData] = useState([]);
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {vendorProfileData?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={vendorProfileData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.row,
                  {
                    justifyContent: "space-around",
                    backgroundColor: Colors.primary.sub,
                    padding: 20,
                    marginHorizontal: 20,
                    marginTop: 20,
                    borderRadius: 12,
                  },
                ]}
              >
                <Image
                  source={{
                    uri:
                      item?.profileImage ||
                      "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
                  }}
                  style={styles.img}
                  resizeMode={"contain"}
                />
                <View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.largeTxt}>{item.fullName}</Text>
                    <Text style={styles.smallTxt}>
                      {item?.vendorDetails?.serivceName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.row,
                      { justifyContent: "flex-end", marginVertical: 5 },
                    ]}
                  >
                    <Text style={styles.smallTxt}>{item.rating || "4.5"}</Text>
                    <MaterialCommunityIcons
                      name="star"
                      size={22}
                      color={Colors.primary.yellow}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() =>
                      navigation.navigate("ServiceProfileDetails", {
                        vendorData: item,
                      })
                    }
                  >
                    <Text style={styles.btnTxt}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noVendorsText}>
            No vendors available for this service in your city.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
  },
  selectServiceText: {
    textAlign: "center",
    color: Colors.primary.lightGray,
    fontSize: 16,
    marginTop: 20,
  },
  noVendorsText: {
    textAlign: "center",
    color: Colors.primary.lightGray,
    fontSize: 16,
    marginTop: 20,
  },
  smallTxt: {
    textTransform: "capitalize",
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  largeTxt: {
    textTransform: "capitalize",
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#0C2D57",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
    height: 120,
    width: 100,
  },
});

export default Services;
