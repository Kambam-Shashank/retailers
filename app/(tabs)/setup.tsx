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
import { LivePreviewCard, RateSetupTabs, TabType } from "@/components/RateSetup/SetupCore";
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
import React, { ReactElement, useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";
import { RateConfig, useRateConfig } from "../../contexts/RateConfigContext";

const GOLD = "#D4AF37";
const BG_LIGHT = "#FFFFFF";
const TEXT_MUTED = "#666";

export default function SetupScreen(): ReactElement {
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
            <View style={styles.header}>
                <Text style={styles.title}>Display Setup</Text>
                <Text style={styles.subtitle}>Configure your live rate board</Text>
            </View>

            <RateSetupTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.scrollContent,
                    isDesktop && styles.scrollContentDesktop,
                ]}
            >
                <View style={styles.previewWrapper}>
                    <LivePreviewCard config={localConfig} scale={0.85} />
                </View>

                {activeTab === "profile" && (
                    <View>
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
                        <NotificationsCard config={localConfig} onUpdate={handleLocalUpdate} />

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
                    </View>
                )}

                {activeTab === "rates" && (
                    <View>
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
                        <RateStatusCard config={localConfig} onUpdate={handleLocalUpdate} />
                    </View>
                )}

                {activeTab === "visual" && (
                    <View>
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
                    </View>
                )}

                <View style={styles.footerActions}>
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
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: GOLD,
    },
    subtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginTop: 4,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    scrollContentDesktop: {
        width: "90%",
        maxWidth: 800,
        alignSelf: "center",
    },
    previewWrapper: {
        marginTop: 5,
        marginBottom: 15,
        alignItems: 'center',
        height: 240,
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: "#F9F9F9",
        borderRadius: 20,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
    },
    footerActions: {
        marginHorizontal: 16,
        marginTop: 32,
        gap: 12,
    },
    saveButton: {
        backgroundColor: GOLD,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 16,
    },
    resetButton: {
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
    },
    resetText: {
        color: "#EF4444",
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#F5F5F5",
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
    },
    cardTitleInternal: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 16,
        textTransform: "uppercase",
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
