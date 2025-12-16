import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRateSetupBranding } from "../customHooks/useRateSetupBranding";

export const BrandingSection = () => {
  const {
    shopName,
    logoBase64,
    handlePickLogo,
    handleDeleteLogo,
    handleShopNameChange,
  } = useRateSetupBranding();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏪 Shop Branding</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={[styles.input, { outlineStyle: "none" } as any]}
          value={shopName}
          onChangeText={handleShopNameChange}
          placeholder="Enter your shop name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Shop Logo</Text>
        {logoBase64 ? (
          <View style={styles.logoPreview}>
            <Image source={{ uri: logoBase64 }} style={styles.logo} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteLogo}
            >
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePickLogo}
          >
            <Text style={styles.uploadButtonText}>📷 Upload Logo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  logoPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#666",
  },
});
