import {
  BrandingPreviewModal,
  NotificationsCard,
  ShopBrandingCard
} from "@/components/RateSetup/BrandingSettings";
import {
  MakingChargesCard,
  MarginsCard,
  PurityLabelsCard,
  RateStatusCard
} from "@/components/RateSetup/RateSettings";
import { RateSetupTabs, TabType } from "@/components/RateSetup/SetupCore";
import { ResetConfirmationModal, SaveSuccessModal } from "@/components/RateSetup/SetupModals";
import {
  CardStyleCard,
  ColorCustomizationCard,
  DisplayCustomizationCard,
  ThemeCard
} from "@/components/RateSetup/VisualSettings";

import { useRateSetupBranding } from "@/customHooks/useRateSetupBranding";
import { useRateSetupLabels } from "@/customHooks/useRateSetupLabels";
import { useRateSetupMargins } from "@/customHooks/useRateSetupMargins";
import { useRouter } from "expo-router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

const GOLD = "#D4AF37";
const BG_LIGHT = "#FFFFFF";
const TEXT_MUTED = "#666"; // Darker muted text for readability on white background

// ====== Main Component ======
export default function RateSetupScreen(): ReactElement {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { config, updateConfig, resetConfigByTab } = useRateConfig();
  const [localConfig, setLocalConfig] = useState<RateConfig>(config);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showBrandingPreview, setShowBrandingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profile");

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

  // Color handlers
  const handleColorChange = (key: string, value: string) => {
    handleLocalUpdate({ [key]: value });
  };

  const handleSave = async () => {
    if (!isDirty) return;
    await updateConfig(localConfig);
    setShowSaveSuccess(true);
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

  const performReset = () => {
    resetConfigByTab(activeTab);
    setShowResetConfirm(false);
  };

  return (
    <View style={styles.screen}>
      <View
        style={[styles.headerWrapper, isDesktop && styles.headerWrapperDesktop]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 15, padding: 5 }}
          >
            <Text style={{ fontSize: 24, color: "#000" }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Rate Setup</Text>
            <Text style={styles.subtitle}>Configure your rate display</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/rates")}
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

      <RateSetupTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDesktop={isDesktop}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        {activeTab === "profile" && (
          <>
            <ShopBrandingCard
              shopName={shopName}
              address={localConfig.shopAddress}
              phone={localConfig.shopPhone}
              logoBase64={logoBase64}
              logoSize={localConfig.logoSize}
              logoPlacement={localConfig.logoPlacement}
              logoOpacity={localConfig.logoOpacity}
              onShopNameChange={handleShopNameChange}
              onShopNameBlur={onShopNameBlur}
              onPickLogo={handlePickLogo}
              onDeleteLogo={handleDeleteLogo}
              onUpdate={(u) => {
                if ("showBrandingPreview" in u) {
                  setShowBrandingPreview(true);
                } else {
                  handleLocalUpdate(u);
                }
              }}
            />

            <RateStatusCard config={localConfig} onUpdate={handleLocalUpdate} />

            {/* Brand Alignment logic - showing it here as requested */}
            <View style={styles.alignmentCard}>
              <Text style={styles.cardTitleInternal}>Branding Alignment</Text>
              <View style={styles.row}>
                {(["left", "center", "right"] as const).map((align) => (
                  <TouchableOpacity
                    key={align}
                    style={[
                      styles.optionButton,
                      localConfig.brandAlignment === align &&
                      styles.optionButtonActive,
                    ]}
                    onPress={() => handleLocalUpdate({ brandAlignment: align })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        localConfig.brandAlignment === align &&
                        styles.optionTextActive,
                      ]}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === "rates" && (
          <>
            <PurityLabelsCard
              gold24kLabel={gold24kLabel}
              gold22kLabel={gold22kLabel}
              silver999Label={silver999Label}
              silver925Label={silver925Label}
              isDesktop={isDesktop}
              onLabelChange={(key, val) => updateLabels({ [key]: val })}
              onLabelsBlur={onLabelsBlur}
            />

            <MarginsCard
              gold24kMargin={gold24kMargin}
              gold22kMargin={gold22kMargin}
              silver999Margin={silver999Margin}
              silver925Margin={silver925Margin}
              isDesktop={isDesktop}
              onMarginUpdate={(key, val) => updateMargin(key as any, val)}
              onMarginInputChange={handleMarginInputChange}
            />

            <MakingChargesCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
            />

            <NotificationsCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
            />
          </>
        )}

        {activeTab === "visual" && (
          <>
            <ThemeCard
              theme={localConfig.theme}
              layoutDensity={localConfig.layoutDensity}
              onUpdate={(key, value) => handleLocalUpdate({ [key]: value })}
            />

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

            <ColorCustomizationCard
              backgroundColor={localConfig.backgroundColor}
              textColor={localConfig.textColor}
              priceColor={localConfig.priceColor}
              onColorChange={handleColorChange}
            />

            <CardStyleCard
              cardBorderRadius={localConfig.cardBorderRadius}
              cardBorderColor={localConfig.cardBorderColor}
              onUpdate={handleLocalUpdate}
            />
          </>
        )}

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

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setShowResetConfirm(true)}
          >
            <Text style={styles.resetText}>⟲ Reset Defaults</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ResetConfirmationModal
        visible={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={performReset}
      />

      <SaveSuccessModal
        visible={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
      />

      <BrandingPreviewModal
        visible={showBrandingPreview}
        onClose={() => setShowBrandingPreview(false)}
        shopName={shopName}
        logoBase64={logoBase64}
        logoSize={localConfig.logoSize}
        logoPlacement={localConfig.logoPlacement}
        logoOpacity={localConfig.logoOpacity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    alignItems: "center",
  },
  headerWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
    width: "100%",
  },
  scrollContentDesktop: {
    width: "90%",
    maxWidth: 1000,
    alignSelf: "center",
    paddingVertical: 24,
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
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  resetText: {
    color: "#EF4444", // Red text for reset
    fontWeight: "600",
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: GOLD,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  saveButtonSmall: {
    backgroundColor: GOLD,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  saveButtonTextSmall: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
    shadowOpacity: 0,
    elevation: 0,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  disabledButtonText: {
    color: "#A1A1A1",
  },
  alignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleInternal: {
    fontSize: 18,
    fontWeight: "700",
    color: GOLD,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  optionText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextActive: {
    color: "#000",
    fontWeight: "600",
  },
});
