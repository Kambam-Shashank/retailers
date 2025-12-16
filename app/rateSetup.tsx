import { ColorCustomizationCard } from "@/components/RateSetup/ColorCustomizationCard";
import { DisplayCustomizationCard } from "@/components/RateSetup/DisplayCustomizationCard";
import { ThemeCard } from "@/components/RateSetup/ThemeCard";
// import { LiveRatesTicker } from "@/components/RateSetup/LiveRatesTicker"; // Removed as per request
import { MarginsCard } from "@/components/RateSetup/MarginsCard";
import { PurityLabelsCard } from "@/components/RateSetup/PurityLabelsCard";
import { ShopBrandingCard } from "@/components/RateSetup/ShopBrandingCard";
import { useRateSetupBranding } from "@/customHooks/useRateSetupBranding";
import { useRateSetupFreeze } from "@/customHooks/useRateSetupFreeze";
import { useRateSetupLabels } from "@/customHooks/useRateSetupLabels";
import { useRateSetupMakingCharges } from "@/customHooks/useRateSetupMakingCharges";
import { useRateSetupMargins } from "@/customHooks/useRateSetupMargins";
import { useRateSetupNotifications } from "@/customHooks/useRateSetupNotifications";
import { NotificationConfig } from "@/types/type";
import { useRouter } from "expo-router";
import React, { ReactElement, memo, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

// ====== Notification Component ======
interface NotificationItemProps {
  notification: NotificationConfig;
  onToggle: () => void;
  onMessageChange: (text: string) => void;
}

const NotificationItem = memo<NotificationItemProps>(
  ({ notification, onToggle, onMessageChange }) => (
    <View style={styles.notificationBlock}>
      <View style={styles.notificationHeaderRow}>
        <TouchableOpacity
          style={[
            styles.switchTrackSmall,
            notification.enabled && styles.switchTrackOn,
          ]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.switchThumbSmall,
              notification.enabled && styles.switchThumbOn,
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.notificationLabel}>
          Notification {notification.id}
        </Text>
      </View>

      <View style={styles.notificationInputWrapper}>
        <TextInput
          style={styles.notificationInput}
          placeholder="Enter notification message..."
          placeholderTextColor="#6B6B6B"
          multiline
          maxLength={100}
          value={notification.message}
          onChangeText={onMessageChange}
        />
        <Text style={styles.charCount}>{notification.message.length}/100</Text>
      </View>
    </View>
  )
);

// ====== Main Component ======
export default function RateSetupScreen(): ReactElement {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { config, updateConfig, resetConfig } = useRateConfig();
  const [localConfig, setLocalConfig] = useState<RateConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleLocalUpdate = (updates: Partial<RateConfig>) => {
    setLocalConfig((prev) => ({ ...prev, ...updates }));
  };

  const isDirty = JSON.stringify(config) !== JSON.stringify(localConfig);

  // Custom Hooks with Local State
  const {
    shopName,
    logoBase64,
    handlePickLogo,
    handleDeleteLogo,
    handleShopNameChange,
  } = useRateSetupBranding(localConfig, handleLocalUpdate);

  const {
    gold24kLabel,
    gold22kLabel,
    silver999Label,
    silver925Label,
    DEFAULT_LABELS,
    updateLabels,
  } = useRateSetupLabels(localConfig, handleLocalUpdate);

  const {
    gold24kMargin,
    gold22kMargin,
    silver999Margin,
    silver925Margin,
    updateMargin,
    handleMarginInputChange,
  } = useRateSetupMargins(localConfig, handleLocalUpdate);

  const {
    makingChargesEnabled,
    makingChargesType,
    makingChargesValue,
    handleToggleMakingCharges,
    handleChangeMakingType,
    handleMakingValueChange,
  } = useRateSetupMakingCharges(localConfig, handleLocalUpdate);

  const {
    notifications,
    toggleNotificationEnabled,
    updateNotificationMessage,
  } = useRateSetupNotifications(localConfig, handleLocalUpdate);

  const { ratesFrozen, formattedFrozenAt, handleToggleFreeze } =
    useRateSetupFreeze(localConfig, handleLocalUpdate);

  // Color handlers
  const handleColorChange = (key: string, value: string) => {
    handleLocalUpdate({ [key]: value });
  };

  const handleSave = async () => {
    if (!isDirty) return;
    await updateConfig(localConfig);
    Alert.alert("Success", "Configuration saved successfully");
  };

  // Setup handlers for onBlur behavior
  const onShopNameBlur = () => {
    if (shopName) {
      handleShopNameChange(shopName.trim());
    }
  };

  const onLabelsBlur = () => {
    updateLabels({
      gold24kLabel: gold24kLabel.trim() || DEFAULT_LABELS.gold24k,
      gold22kLabel: gold22kLabel.trim() || DEFAULT_LABELS.gold22k,
      silver999Label: silver999Label.trim() || DEFAULT_LABELS.silver999,
      silver925Label: silver925Label.trim() || DEFAULT_LABELS.silver925,
    });
  };

  return (
    <View style={styles.screen}>
      <View
        style={[styles.headerWrapper, isDesktop && styles.headerWrapperDesktop]}
      >
        <View>
          <Text style={styles.title}>Rate Setup</Text>
          <Text style={styles.subtitle}>Configure your rate display</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/ratesDIsplay")}
          >
            <Text style={styles.buttonText}>Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButtonSmall, !isDirty && styles.disabledButton]}
            onPress={handleSave}
            disabled={!isDirty}
          >
            <Text
              style={[
                styles.saveButtonTextSmall,
                !isDirty && styles.disabledButtonText,
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        {/* LIVE RATES TICKER */}
        {/* LIVE RATES TICKER - REMOVED */}
        {/* <LiveRatesTicker /> */}

        {/* SHOP BRANDING CARD */}
        <ShopBrandingCard
          shopName={shopName}
          logoBase64={logoBase64}
          onShopNameChange={handleShopNameChange}
          onShopNameBlur={onShopNameBlur}
          onPickLogo={handlePickLogo}
          onDeleteLogo={handleDeleteLogo}
        />

        {/* THEME CARD */}
        <ThemeCard
          theme={localConfig.theme}
          layoutDensity={localConfig.layoutDensity}
          onUpdate={(key, value) => handleLocalUpdate({ [key]: value })}
        />

        {/* DISPLAY CUSTOMIZATION CARD */}
        <DisplayCustomizationCard
          fontTheme={localConfig.fontTheme}
          cardStyle={localConfig.cardStyle}
          showTime={localConfig.showTime}
          showShopName={localConfig.showShopName}
          showDate={localConfig.showDate}
          brandAlignment={localConfig.brandAlignment}
          showGold24k={localConfig.showGold24k}
          showGold22k={localConfig.showGold22k}
          showSilver999={localConfig.showSilver999}
          showSilver925={localConfig.showSilver925}
          priceDecimalPlaces={localConfig.priceDecimalPlaces}
          onUpdate={(key, value) => handleLocalUpdate({ [key]: value })}
        />

        {/* PURITY LABELS CARD */}
        <PurityLabelsCard
          gold24kLabel={gold24kLabel}
          gold22kLabel={gold22kLabel}
          silver999Label={silver999Label}
          silver925Label={silver925Label}
          isDesktop={isDesktop}
          onLabelChange={(key, val) => updateLabels({ [key]: val })}
          onLabelsBlur={onLabelsBlur}
        />

        {/* MARGINS CARD */}
        <MarginsCard
          gold24kMargin={gold24kMargin}
          gold22kMargin={gold22kMargin}
          silver999Margin={silver999Margin}
          silver925Margin={silver925Margin}
          isDesktop={isDesktop}
          onMarginUpdate={(key, val) => updateMargin(key as any, val)}
          onMarginInputChange={handleMarginInputChange}
        />

        {/* MAKING CHARGES CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Making Charges</Text>
          <Text style={styles.cardSubtitle}>
            Display making charges on the rate board
          </Text>

          <View style={styles.sectionRow}>
            <Text style={styles.label}>Enable Making Charges</Text>
            <TouchableOpacity
              style={[
                styles.switchTrack,
                makingChargesEnabled && styles.switchTrackOn,
              ]}
              onPress={handleToggleMakingCharges}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.switchThumb,
                  makingChargesEnabled && styles.switchThumbOn,
                ]}
              />
            </TouchableOpacity>
          </View>

          {makingChargesEnabled && (
            <>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleChangeMakingType("percentage")}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      makingChargesType === "percentage" &&
                      styles.radioOuterActive,
                    ]}
                  >
                    {makingChargesType === "percentage" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      makingChargesType === "percentage" &&
                      styles.radioLabelActive,
                    ]}
                  >
                    Percentage (%)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleChangeMakingType("perGram")}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      makingChargesType === "perGram" &&
                      styles.radioOuterActive,
                    ]}
                  >
                    {makingChargesType === "perGram" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      makingChargesType === "perGram" &&
                      styles.radioLabelActive,
                    ]}
                  >
                    Per Gram (₹/g)
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.makingValueRow}>
                <View style={[styles.inputWrapper, styles.makingInputWrapper]}>
                  <TextInput
                    keyboardType="numeric"
                    style={styles.textInput}
                    value={
                      makingChargesValue === 0 ? "" : String(makingChargesValue)
                    }
                    onChangeText={handleMakingValueChange}
                    placeholder="0"
                    placeholderTextColor="#A3A3A3"
                  />
                </View>
                <Text style={styles.makingUnitText}>
                  {makingChargesType === "percentage" ? "%" : "₹/g"}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* NOTIFICATIONS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardSubtitle}>
            Add up to 3 announcements for your customers
          </Text>

          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onToggle={() => toggleNotificationEnabled(n.id)}
              onMessageChange={(text) => updateNotificationMessage(n.id, text)}
            />
          ))}
        </View>

        {/* COLOR CUSTOMIZATION CARD */}
        <ColorCustomizationCard
          backgroundColor={localConfig.backgroundColor}
          textColor={localConfig.textColor}
          priceColor={localConfig.priceColor}
          onColorChange={handleColorChange}
        />

        {/* RATE STATUS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rate Status</Text>
          <Text style={styles.cardSubtitle}>
            {ratesFrozen
              ? `Rates are frozen${formattedFrozenAt ? ` since ${formattedFrozenAt}` : ""}.`
              : "Rates are live and updating every 10 seconds."}
          </Text>

          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={[
                styles.freezeButton,
                ratesFrozen ? styles.freezeButtonUnfreeze : null,
              ]}
              onPress={handleToggleFreeze}
            >
              <Text style={styles.freezeButtonText}>
                {ratesFrozen ? "Unfreeze Rates" : "Freeze Rates"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER ACTIONS */}
        <View style={styles.footerActions}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.saveButton, !isDirty && styles.disabledButton]}
            onPress={handleSave}
            disabled={!isDirty}
          >
            <Text
              style={[
                styles.saveButtonText,
                !isDirty && styles.disabledButtonText,
              ]}
            >
              Save Configuration
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetConfig}>
            <Text style={styles.resetText}>⟲ Reset Defaults</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const GOLD = "#D4AF37";
const GOLD_SOFT = "#D4AF3733";
const BG_DARK = "#000000";
const CARD_DARK = "#121212";
const TEXT_MUTED = "#A1A1A1";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_DARK,
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 10,
  },
  headerWrapperDesktop: {
    paddingHorizontal: 32,
    maxWidth: 1200,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: GOLD,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentDesktop: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "#0F0F0F",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.15)", // Subtle gold border
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#161616",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    color: "#fff",
    fontSize: 14,
    paddingVertical: 8,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#222",
    padding: 4,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  switchTrackSmall: {
    width: 40,
    height: 22,
    borderRadius: 14,
    backgroundColor: "#333",
    padding: 3,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: GOLD,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#111",
    alignSelf: "flex-start",
  },
  switchThumbSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#111",
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
  },
  radioRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioOuterActive: {
    borderColor: GOLD,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: GOLD,
  },
  radioLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  radioLabelActive: {
    color: GOLD,
  },
  makingValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  makingInputWrapper: {
    flex: 0.4,
  },
  makingUnitText: {
    marginLeft: 10,
    fontSize: 15,
    color: TEXT_MUTED,
    fontWeight: "600",
  },
  notificationBlock: {
    marginBottom: 16,
  },
  notificationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#fff",
  },
  notificationInputWrapper: {
    borderRadius: 12,
    backgroundColor: "#181818",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
    position: "relative",
  },
  notificationInput: {
    color: "#fff",
    fontSize: 15,
    minHeight: 40,
    lineHeight: 20,
  },
  charCount: {
    position: "absolute",
    right: 10,
    bottom: 6,
    fontSize: 11,
    color: TEXT_MUTED,
  },
  freezeButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  freezeButtonUnfreeze: {
    backgroundColor: "#16A34A",
  },
  freezeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  footerActions: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resetButton: {
    marginLeft: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
  },
  resetText: {
    color: "#fff",
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: GOLD,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  saveButtonSmall: {
    backgroundColor: GOLD,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginLeft: 12,
  },
  saveButtonTextSmall: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#333",
    borderColor: "#444",
    borderWidth: 1,
  },
  disabledButtonText: {
    color: "#666",
  },
});
