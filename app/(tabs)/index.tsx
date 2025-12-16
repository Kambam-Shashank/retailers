import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

export default function Karatpay() {
  const router = useRouter();

  const handleWhatsAppShare = () => {
    Alert.alert("WhatsApp Share", "This will open WhatsApp to share the app");
  };
   

  


  return (
    <ScrollView style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      <View style={styles.header}>
        <Text style={styles.logo}>Karatpay</Text>
        <Text style={styles.tagline}>
          Real-time bullion rates for your jewellery business
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/ratesDIsplay")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="remove-red-eye" size={24} color="#FFD700" />
          </View>
          <Text style={styles.cardTitle}>Rate Display</Text>
          <Text style={styles.cardDescription}>
            Show real-time gold and silver rates to your customers with
            beautiful, customizable displays
          </Text>
          <View style={styles.cardButton}>
            <Text style={styles.cardButtonText}>View Live Rates</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#FFD700" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/rateSetup")}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="cog" size={24} color="#FFD700" />
          </View>
          <Text style={styles.cardTitle}>Rate Setup</Text>
          <Text style={styles.cardDescription}>
            Configure margins, making charges, branding, and notifications for
            your rate display
          </Text>
          <View style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Configure Rates</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#FFD700" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• Live API Updates</Text>
        </View>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• Custom Margins</Text>
        </View>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• Making Charges</Text>
        </View>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• GST Settings</Text>
        </View>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• Branding Options</Text>
        </View>
        <View style={styles.featureTag}>
          <Text style={styles.featureText}>• Notifications</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={handleWhatsAppShare}
      >
        <MaterialIcons name="chat" size={24} color="#25D366" />
        <Text style={styles.whatsappButtonText}>Share on WhatsApp</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.copyright}>
          {" "}
          2024 Karatpay. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily:"Inter Tight"
  },
  cardDescription: {
    fontSize: 14,
    color: "#888888",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardButtonText: {
    fontSize: 14,
    color: "#FFD700",
    marginRight: 8,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featureTag: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  featureText: {
    fontSize: 12,
    color: "#888888",
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#25D366",
  },
  whatsappButtonText: {
    fontSize: 16,
    color: "#25D366",
    marginLeft: 12,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  copyright: {
    fontSize: 12,
    color: "#666666",
  },
});
