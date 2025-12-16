import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GOLD = "#D4AF37";
const CARD_DARK = "#121212";
const GOLD_SOFT = "#D4AF3733";
const TEXT_MUTED = "#A1A1A1";

interface ColorCustomizationCardProps {
  backgroundColor: string;
  textColor: string;
  priceColor: string;
  onColorChange: (key: string, value: string) => void;
}

export const ColorCustomizationCard: React.FC<ColorCustomizationCardProps> = ({
  backgroundColor,
  textColor,
  priceColor,
  onColorChange,
}) => {
  const handleRandomize = () => {
    const palettes = [
      { bg: "#050505", text: "#F5F5F5", price: "#FFD700" },
      { bg: "#111827", text: "#E5E7EB", price: "#F59E0B" },
      { bg: "#022C22", text: "#D1FAE5", price: "#34D399" },
      { bg: "#1E1B4B", text: "#E0E7FF", price: "#A855F7" },
      { bg: "#312E81", text: "#E5E7EB", price: "#F97316" },
    ];
    const pick = palettes[Math.floor(Math.random() * palettes.length)];
    onColorChange("backgroundColor", pick.bg);
    onColorChange("textColor", pick.text);
    onColorChange("priceColor", pick.price);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Display Colors</Text>
      <Text style={styles.cardSubtitle}>
        Customize the colors for your rate display board
      </Text>

      {/* Background Color */}
      <View style={styles.colorRow}>
        <View style={styles.colorInfo}>
          <Text style={styles.label}>Background Color</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="#000000"
                placeholderTextColor="#A3A3A3"
                style={[styles.textInput, { outlineStyle: "none" } as any]}
                value={backgroundColor}
                onChangeText={(text) => onColorChange("backgroundColor", text)}
                maxLength={7}
                autoCapitalize="none"
              />
            </View>
            <View
              style={[
                styles.colorPreview,
                { backgroundColor: backgroundColor },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Text Color */}
      <View style={styles.colorRow}>
        <View style={styles.colorInfo}>
          <Text style={styles.label}>Text Color</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="#FFFFFF"
                placeholderTextColor="#A3A3A3"
                style={[styles.textInput, { outlineStyle: "none" } as any]}
                value={textColor}
                onChangeText={(text) => onColorChange("textColor", text)}
                maxLength={7}
                autoCapitalize="none"
              />
            </View>
            <View
              style={[styles.colorPreview, { backgroundColor: textColor }]}
            />
          </View>
        </View>
      </View>

      {/* Price Color */}
      <View style={styles.colorRow}>
        <View style={styles.colorInfo}>
          <Text style={styles.label}>Price Color</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="#D4AF37"
                placeholderTextColor="#A3A3A3"
                style={[styles.textInput, { outlineStyle: "none" } as any]}
                value={priceColor}
                onChangeText={(text) => onColorChange("priceColor", text)}
                maxLength={7}
                autoCapitalize="none"
              />
            </View>
            <View
              style={[styles.colorPreview, { backgroundColor: priceColor }]}
            />
          </View>
        </View>
      </View>

      {/* Color Presets */}
      <View style={styles.presetsSection}>
        <Text style={styles.presetsTitle}>Quick Presets</Text>
        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#0A0A0A");
              onColorChange("textColor", "#E8E8E8");
              onColorChange("priceColor", "#FFD700");
            }}
          >
            <Text style={styles.presetText}>Elegant Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#1A1F3A");
              onColorChange("textColor", "#F0F0F0");
              onColorChange("priceColor", "#FFA500");
            }}
          >
            <Text style={styles.presetText}>Royal Blue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#1C0A28");
              onColorChange("textColor", "#E6D5F0");
              onColorChange("priceColor", "#FFB84D");
            }}
          >
            <Text style={styles.presetText}>Deep Purple</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#0D1F1A");
              onColorChange("textColor", "#D4E8D4");
              onColorChange("priceColor", "#50C878");
            }}
          >
            <Text style={styles.presetText}>Emerald Luxury</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#2C1810");
              onColorChange("textColor", "#F5E6D3");
              onColorChange("priceColor", "#E0AC69");
            }}
          >
            <Text style={styles.presetText}>Rose Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              onColorChange("backgroundColor", "#0F1419");
              onColorChange("textColor", "#C9D1D9");
              onColorChange("priceColor", "#58A6FF");
            }}
          >
            <Text style={styles.presetText}>Midnight Navy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.randomRow}>
          <TouchableOpacity
            style={styles.randomButton}
            onPress={handleRandomize}
          >
            <Text style={styles.randomText}>Random Theme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F0F0F",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: GOLD,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 24,
  },
  colorRow: {
    marginBottom: 20,
  },
  colorInfo: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#161616",
    marginRight: 16,
  },
  textInput: {
    color: "#fff",
    fontSize: 15,
    paddingVertical: 10,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  colorPreview: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  presetsSection: {
    marginTop: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  presetsTitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
    marginBottom: 10,
  },
  presetText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  randomRow: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  randomButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: GOLD_SOFT,
    borderWidth: 1,
    borderColor: GOLD,
  },
  randomText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
