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

const Search = ({}) => {
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  const fetchServices = async () => {
    const result = await apiRequest(urlType.BACKEND, {
      method: "get",
      url: `/search/service-name?serviceName=${searchQuery}`,
    });
    if (result?.status === 200) setServicesData(result.data);
  };

  const { data: vendorProfileData, refetch: fetchVendorProfile } = useQuery({
    queryKey: ["vendorProfile", selectedCity, selectedServiceId],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/search/user-details?serviceId=${selectedServiceId}&city=${selectedCity}`,
      });
      return result?.status === 200 ? result.data : [];
    },
    enabled: false,
  });

  useEffect(() => {
    if (searchQuery) fetchServices();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCity && selectedServiceId) {
      fetchVendorProfile();
    }
  }, [selectedCity, selectedServiceId]);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        setServicesData([]);
        setSelectedServiceId(item._id);
        setSearchQuery(item.serivceName);
      }}
    >
      <Text style={styles.resultText}>{item.serivceName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <CustomSearchInput
          containerStyle={{ width: "60%" }}
          placeholder="Search for services..."
          iconName="search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Dropdown
          inputStyle={{ width: "30%", marginBottom: 0 }}
          options={citiesName}
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          defaultValue={"City"}
        />
      </View>

      {/* Render search results dropdown */}
      {servicesData.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={servicesData}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}

      <View style={styles.profileContainer}>
        {selectedServiceId ? (
          vendorProfileData?.length > 0 ? (
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
                      <Text style={styles.smallTxt}>
                        {item.rating || "4.5"}
                      </Text>
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
              No vendors available for this service in the selected city.
            </Text>
          )
        ) : (
          <Text style={styles.selectServiceText}>
            Select a service to view available vendors.
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
    borderTopWidth: 2,
    borderColor: Colors.primary.borderColor,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    zIndex: 1,
  },
  dropdownContainer: {
    position: "absolute",
    top: 70,
    left: 10,
    width: "60%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    borderRadius: 5,
    zIndex: 10,
    maxHeight: 100,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: Colors.primary.sub,
  },
  resultText: {
    fontSize: 16,
    color: Colors.primary.black,
    textTransform: "capitalize",
  },
  profileContainer: {
    flex: 1,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: Colors.primary.borderColor,
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

export default Search;
