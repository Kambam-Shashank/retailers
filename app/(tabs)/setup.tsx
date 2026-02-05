import { NotificationsCard, ShopBrandingCard } from "@/components/RateSetup/BrandingSettings";
import {
  GSTSettingsCard,
  MakingChargesCard,
  MarginsCard,
  PurityLabelsCard,
  RateStatusCard,
} from "@/components/RateSetup/RateSettings";
import { LivePreview, RateSetupTabs, TabType } from "@/components/RateSetup/SetupBase";
import {
  BrandingPreviewModal,
  ResetConfirmationModal,
  SaveSuccessModal,
} from "@/components/RateSetup/SetupModals";
import { ColorCustomizationCard } from "@/components/RateSetup/VisualSettings";

import { RateConfig, useRateConfig } from "@/contexts/RateConfigContext";
import { useRateSetupBranding } from "@/customHooks/useRateSetupBranding";
import { useRateSetupLabels } from "@/customHooks/useRateSetupLabels";
import { useRateSetupMargins } from "@/customHooks/useRateSetupMargins";
import { useRouter } from "expo-router";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const GOLD = "#D4AF37";
const BG_LIGHT = "#FFFFFF";
const TEXT_MUTED = "#666";

export default function RateSetupScreen(): ReactElement {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 420;
  const isSmallMobile = width < 360;

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
    gold20kLabel,
    gold18kLabel,
    gold14kLabel,
    silver999Label,
    silver925Label,
    DEFAULT_LABELS,
    updateLabels,
  } = useRateSetupLabels(localConfig, handleLocalUpdate);

  const {
    gold24kMargin,
    gold22kMargin,
    gold20kMargin,
    gold18kMargin,
    gold14kMargin,
    silver999Margin,
    silver925Margin,
    updateMargin,
    handleMarginInputChange,
  } = useRateSetupMargins(localConfig, handleLocalUpdate);

  const handleColorChange = (key: string, value: string) => {
    handleLocalUpdate({ [key]: value });
  };

  const handleSave = async () => {
    if (!isDirty) return;
    await updateConfig(localConfig);
    setShowSaveSuccess(true);
  };

  const onShopNameBlur = () => {
    if (shopName) {
      handleShopNameChange(shopName.trim());
    }
  };

  const onLabelsBlur = () => {
    updateLabels({
      gold24kLabel: gold24kLabel.trim() || DEFAULT_LABELS.gold24k,
      gold22kLabel: gold22kLabel.trim() || DEFAULT_LABELS.gold22k,
      gold20kLabel: gold20kLabel.trim() || DEFAULT_LABELS.gold20k,
      gold18kLabel: gold18kLabel.trim() || DEFAULT_LABELS.gold18k,
      gold14kLabel: gold14kLabel.trim() || DEFAULT_LABELS.gold14k,
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
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, isMobile && { fontSize: isSmallMobile ? 18 : 20 }]}>
                Rate Setup
              </Text>
              <Text style={styles.headerSubtitle}>Configure your display</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => router.push("/")}
            >
              <Text style={[styles.previewButtonText, isMobile && { fontSize: 13 }]}>
                Preview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButtonTop, !isDirty && styles.disabledButton]}
              onPress={handleSave}
              disabled={!isDirty}
            >
              <Text
                style={[
                  styles.saveButtonTextTop,
                  isMobile && { fontSize: 13 },
                  !isDirty && styles.disabledButtonText,
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <RateSetupTabs activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
      >
        {activeTab === "profile" && (
          <>
            <LivePreview config={localConfig} />

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
              onUpdate={(u: Partial<RateConfig>) => {
                if ("showBrandingPreview" in u) {
                  setShowBrandingPreview(true);
                } else {
                  handleLocalUpdate(u);
                }
              }}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />

            <NotificationsCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />

            <RateStatusCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />
          </>
        )}

        {activeTab === "rates" && (
          <>
            <LivePreview config={localConfig} />

            <PurityLabelsCard
              gold24kLabel={gold24kLabel}
              gold22kLabel={gold22kLabel}
              gold20kLabel={gold20kLabel}
              gold18kLabel={gold18kLabel}
              gold14kLabel={gold14kLabel}
              silver999Label={silver999Label}
              silver925Label={silver925Label}
              showGold24k={localConfig.showGold24k}
              showGold22k={localConfig.showGold22k}
              showGold20k={localConfig.showGold20k}
              showGold18k={localConfig.showGold18k}
              showGold14k={localConfig.showGold14k}
              showSilver999={localConfig.showSilver999}
              showSilver925={localConfig.showSilver925}

              onLabelChange={(key, val) => updateLabels({ [key]: val })}
              onUpdate={(key, val) => handleLocalUpdate({ [key]: val })}
              onLabelsBlur={onLabelsBlur}
              purityOrder={
                localConfig.purityOrder || [
                  "gold24k",
                  "gold22k",
                  "gold20k",
                  "gold18k",
                  "gold14k",
                  "silver999",
                  "silver925",
                ]
              }
              onOrderChange={(newOrder) =>
                handleLocalUpdate({ purityOrder: newOrder })
              }
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />

            <MarginsCard
              gold24kMargin={gold24kMargin}
              gold22kMargin={gold22kMargin}
              gold20kMargin={gold20kMargin}
              gold18kMargin={gold18kMargin}
              gold14kMargin={gold14kMargin}
              silver999Margin={silver999Margin}
              silver925Margin={silver925Margin}

              onMarginUpdate={(key, val) => updateMargin(key as any, val)}
              onMarginInputChange={handleMarginInputChange}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />

            <MakingChargesCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />

            <GSTSettingsCard
              config={localConfig}
              onUpdate={handleLocalUpdate}
              isMobile={isMobile}
              isSmallMobile={isSmallMobile}
            />
          </>
        )}

        {activeTab === "visual" && (
          <>
            <LivePreview config={localConfig} />

            <ColorCustomizationCard
              backgroundColor={localConfig.backgroundColor}
              textColor={localConfig.textColor}
              priceColor={localConfig.priceColor}
              cardBackgroundColor={localConfig.cardBackgroundColor}
              onColorChange={handleColorChange}
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
                isMobile && { fontSize: isSmallMobile ? 13 : 14 },
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
            <Text
              style={[
                styles.resetText,
                isMobile && { fontSize: isSmallMobile ? 12 : 13 },
              ]}
            >
              ⟲ Reset Defaults
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ResetConfirmationModal
        visible={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={performReset}
        tabName={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  headerWrapper: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: BG_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: GOLD,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: -2,
  },
  previewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  previewButtonText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonTop: {
    backgroundColor: GOLD,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonTextTop: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 12,
  },
  footerActions: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  resetText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 15,
  },
  saveButton: {
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
