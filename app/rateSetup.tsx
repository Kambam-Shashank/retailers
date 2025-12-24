import { BrandingPreviewModal } from "@/components/RateSetup/BrandingPreviewModal";
import { CardStyleCard } from "@/components/RateSetup/CardStyleCard";
import { ColorCustomizationCard } from "@/components/RateSetup/ColorCustomizationCard";
import { DisplayCustomizationCard } from "@/components/RateSetup/DisplayCustomizationCard";
import { MakingChargesCard } from "@/components/RateSetup/MakingChargesCard";
import { MarginsCard } from "@/components/RateSetup/MarginsCard";
import { NotificationsCard } from "@/components/RateSetup/NotificationsCard";
import { PurityLabelsCard } from "@/components/RateSetup/PurityLabelsCard";
import { RateStatusCard } from "@/components/RateSetup/RateStatusCard";
import { ResetConfirmationModal } from "@/components/RateSetup/ResetConfirmationModal";
import { SaveSuccessModal } from "@/components/RateSetup/SaveSuccessModal";
import { ShopBrandingCard } from "@/components/RateSetup/ShopBrandingCard";
import { ShopDetailsCard } from "@/components/RateSetup/ShopDetailsCard";
import { ThemeCard } from "@/components/RateSetup/ThemeCard";

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
const BG_DARK = "#000000";
const TEXT_MUTED = "#A1A1A1";

// ====== Main Component ======
export default function RateSetupScreen(): ReactElement {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { config, updateConfig, resetConfig } = useRateConfig();
  const [localConfig, setLocalConfig] = useState<RateConfig>(config);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showBrandingPreview, setShowBrandingPreview] = useState(false);

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
    resetConfig();
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
            <Text style={{ fontSize: 24, color: "#FFF" }}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Rate Setup</Text>
            <Text style={styles.subtitle}>Configure your rate display</Text>
          </View>
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
        <ShopBrandingCard
          shopName={shopName}
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

        <ShopDetailsCard
          address={localConfig.shopAddress}
          phone={localConfig.shopPhone}
          email={localConfig.shopEmail}
          onUpdate={handleLocalUpdate}
        />

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

        <MakingChargesCard config={localConfig} onUpdate={handleLocalUpdate} />

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

        <ThemeCard
          theme={localConfig.theme}
          layoutDensity={localConfig.layoutDensity}
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

        <NotificationsCard config={localConfig} onUpdate={handleLocalUpdate} />

        <RateStatusCard config={localConfig} onUpdate={handleLocalUpdate} />

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
    borderColor: "#333",
    backgroundColor: "#1F1F1F",
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
    backgroundColor: "#222",
    shadowOpacity: 0,
    elevation: 0,
    borderColor: "#333",
    borderWidth: 0,
  },
  disabledButtonText: {
    color: "#555",
  },
});
