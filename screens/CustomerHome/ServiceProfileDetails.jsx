import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import profileImg from "../../assets/profileImg.jpg";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/theme";

const ServiceProfileDetails = ({ route }) => {
  const navigation = useNavigation();
  const { vendorData } = route?.params;

  return (
    <View style={styles.container}>
      {/* Profile Image and Name */}
      <View style={{ alignItems: "center" }}>
        <Image
          source={{
            uri:
              vendorData?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.img}
          resizeMode={"cover"}
        />
        <Text style={styles.largeTxt}>{vendorData?.fullName}</Text>
      </View>
      <ScrollView>
        {/* Service Details */}
        <View style={[styles.row, styles.serviceDetails]}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>
              {vendorData.vendorDetails.serivceName}
            </Text>
            <Text style={styles.smallTxt}>
              {vendorData.vendorDetails.workDescription}
            </Text>
          </View>
        </View>

        {/* Experience and Rating */}
        <View style={[styles.row, styles.experienceRating]}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>Experience</Text>
            <Text style={[styles.largeTxt, { fontWeight: "800" }]}>
              {vendorData.vendorDetails.workExperience} Yr
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>Rating</Text>
            <View style={styles.rating}>
              <MaterialCommunityIcons
                name="star"
                size={20}
                color={Colors.primary.yellow}
              />
              <Text style={[styles.largeTxt, { fontWeight: "800" }]}>
                {vendorData?.vendorDetails?.averageRating || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.headerText}>Contact Information</Text>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="email" size={20} color="#0C2D57" />
            <TouchableOpacity
              onPress={() => Linking.openURL(`mailto:${vendorData.email}`)}
            >
              <Text style={styles.contactText}>{vendorData.email}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#0C2D57" />
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${vendorData.mobileNo}`)}
            >
              <Text style={styles.contactText}>{vendorData.mobileNo}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#0C2D57"
            />
            <Text style={styles.contactText}>{vendorData.address}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="city" size={20} color="#0C2D57" />
            <Text style={styles.contactText}>{vendorData.city}</Text>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate("DirectProposal", { vendorData: vendorData })
            }
          >
            <Text style={styles.btnTxt}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  headerText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  contactContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  smallTxt: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
  },
  largeTxt: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  serviceDetails: {
    justifyContent: "space-around",
    backgroundColor: "lightgrey",
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  experienceRating: {
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
    height: 180,
    width: 160,
    borderRadius: 18,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#0C2D57",
    padding: 15,
    borderRadius: 12,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
    textAlign: "center",
  },
});

export default ServiceProfileDetails;
