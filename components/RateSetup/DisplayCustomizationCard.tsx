import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

interface DisplayCustomizationCardProps {
  fontTheme: "modern" | "classic" | "serif";
  cardStyle: "boxed" | "minimal";
  showTime: boolean;
  showShopName: boolean;
  showDate: boolean;
  brandAlignment?: "left" | "center" | "right";
  showGold24k: boolean;
  showGold22k: boolean;
  showSilver999: boolean;
  showSilver925: boolean;
  priceDecimalPlaces: 0 | 1 | 2;
  onUpdate: (key: string, value: any) => void;
}

export const DisplayCustomizationCard: React.FC<
  DisplayCustomizationCardProps
> = ({
  fontTheme,
  cardStyle,
  showTime,
  showShopName,
  showDate,
  brandAlignment = "center",
  showGold24k,
  showGold22k,
  showSilver999,
  showSilver925,
  priceDecimalPlaces,
  onUpdate,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Display Options</Text>
      <Text style={styles.cardSubtitle}>
        Customize layout, fonts, and visibility
      </Text>

      {/* Font Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Style</Text>
        <View style={styles.row}>
          {(["modern", "classic", "serif"] as const).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.optionButton,
                fontTheme === theme && styles.optionButtonActive,
              ]}
              onPress={() => onUpdate("fontTheme", theme)}
            >
              <Text
                style={[
                  styles.optionText,
                  fontTheme === theme && styles.optionTextActive,
                  {
                    fontFamily:
                      theme === "serif"
                        ? "serif"
                        : theme === "classic"
                          ? "monospace" // Fallback for classic if no font linked
                          : "System", // Modern
                  },
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Layout</Text>
        <View style={styles.row}>
          {(["boxed", "minimal"] as const).map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.optionButton,
                cardStyle === style && styles.optionButtonActive,
              ]}
              onPress={() => onUpdate("cardStyle", style)}
            >
              <Text
                style={[
                  styles.optionText,
                  cardStyle === style && styles.optionTextActive,
                ]}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Branding Alignment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Branding Alignment</Text>
        <View style={styles.row}>
          {(["left", "center", "right"] as const).map((align) => (
            <TouchableOpacity
              key={align}
              style={[
                styles.optionButton,
                brandAlignment === align && styles.optionButtonActive,
              ]}
              onPress={() => onUpdate("brandAlignment", align)}
            >
              <Text
                style={[
                  styles.optionText,
                  brandAlignment === align && styles.optionTextActive,
                ]}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Header Visibility Toggles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Header Visibility</Text>
        {[
          { label: "Show Time", key: "showTime", val: showTime },
          { label: "Show Shop Name", key: "showShopName", val: showShopName },
          // { label: "Show Date", key: "showDate", val: showDate },
        ].map((item) => (
          <View style={styles.toggleRow} key={item.key}>
            <Text style={styles.toggleLabel}>{item.label}</Text>
            <TouchableOpacity
              style={[styles.switchTrack, item.val && styles.switchTrackOn]}
              onPress={() => onUpdate(item.key, !item.val)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.switchThumb, item.val && styles.switchThumbOn]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Row Visibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rows Visible</Text>
        {[
          { label: "24K Gold (999)", key: "showGold24k", val: showGold24k },
          { label: "22K Gold (916)", key: "showGold22k", val: showGold22k },
          { label: "Silver (999)", key: "showSilver999", val: showSilver999 },
          { label: "Silver (925)", key: "showSilver925", val: showSilver925 },
        ].map((item) => (
          <View style={styles.toggleRow} key={item.key}>
            <Text style={styles.toggleLabel}>{item.label}</Text>
            <TouchableOpacity
              style={[styles.switchTrack, item.val && styles.switchTrackOn]}
              onPress={() => onUpdate(item.key, !item.val)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.switchThumb, item.val && styles.switchThumbOn]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Price Precision */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Precision</Text>
        <View style={styles.row}>
          {[0, 1, 2].map((places) => (
            <TouchableOpacity
              key={places}
              style={[
                styles.optionButton,
                priceDecimalPlaces === places && styles.optionButtonActive,
              ]}
              onPress={() => onUpdate("priceDecimalPlaces", places)}
            >
              <Text
                style={[
                  styles.optionText,
                  priceDecimalPlaces === places && styles.optionTextActive,
                ]}
              >
                {places} decimals
              </Text>
            </TouchableOpacity>
          ))}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#FFF",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
  },
  optionButtonActive: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderColor: GOLD,
  },
  optionText: {
    color: "#DDD",
    fontSize: 14,
  },
  optionTextActive: {
    color: GOLD,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: {
    color: "#DDD",
    fontSize: 15,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#222",
    padding: 2,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: GOLD,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#555",
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    backgroundColor: "#000",
    alignSelf: "flex-end",
  },
});
