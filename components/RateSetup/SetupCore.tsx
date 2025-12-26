import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { RateConfig } from "../../contexts/RateConfigContext";

// ====== Types ======
export type TabType = "profile" | "rates" | "visual";

const GOLD = "#D4AF37";

// ====== RateSetupTabs ======
interface RateSetupTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    isDesktop?: boolean;
}

export const RateSetupTabs: React.FC<RateSetupTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const tabs: { key: TabType; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
        { key: "profile", label: "Profile", icon: "storefront-outline" },
        { key: "rates", label: "Rates", icon: "currency-inr" },
        { key: "visual", label: "Theme", icon: "palette-outline" },
    ];

    return (
        <View style={tabsStyles.container}>
            <View style={tabsStyles.tabBar}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[tabsStyles.tab, isActive && tabsStyles.activeTab]}
                            onPress={() => onTabChange(tab.key)}
                        >
                            <View style={tabsStyles.tabContent}>
                                <MaterialCommunityIcons
                                    name={tab.icon}
                                    size={18}
                                    color={isActive ? "#000" : "#666"}
                                    style={tabsStyles.icon}
                                />
                                <Text style={[tabsStyles.tabText, isActive && tabsStyles.activeTabText]}>
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

// ====== LivePreviewCard ======
interface LivePreviewCardProps {
    config: RateConfig;
    scale?: number;
}

export const LivePreviewCard: React.FC<LivePreviewCardProps> = ({
    config,
    scale = 0.8,
}) => {
    // Sample Data for Preview
    const sampleRates = {
        gold24k: 7854.20,
        gold22k: 7215.45,
        silver999: 94.30,
        silver925: 88.15,
    };

    const formatPrice = (price: number) => {
        const decimals = config.priceDecimalPlaces ?? 0;
        return `₹${price.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })}`;
    };

    const formatTime = (date: Date) => {
        return date.toLocaleString("en-IN", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const alignmentStyle = {
        alignItems: config.brandAlignment === 'left' ? 'flex-start' :
            config.brandAlignment === 'right' ? 'flex-end' : 'center',
        textAlign: config.brandAlignment as any,
    } as const;

    return (
        <View style={[previewStyles.previewContainer, { transform: [{ scale }] }]}>
            {/* Mini Header */}
            <View style={[previewStyles.miniHeader, {
                justifyContent: config.brandAlignment === 'center' ? 'center' :
                    config.brandAlignment === 'left' ? 'flex-start' : 'flex-end'
            }]}>
                {config.showTime && config.brandAlignment !== 'left' && (
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Text style={[previewStyles.miniTime, { color: config.textColor || "#FFF" }]}>
                            {formatTime(new Date())}
                        </Text>
                    </View>
                )}

                <View style={[previewStyles.brandingContainer, alignmentStyle]}>
                    {config.logoBase64 && config.logoPlacement === 'header' && (
                        <Image
                            source={{ uri: config.logoBase64 }}
                            style={{ width: config.logoSize * 0.5, height: config.logoSize * 0.5, marginBottom: 4 }}
                            resizeMode="contain"
                        />
                    )}
                    {config.showShopName && (
                        <Text
                            style={[
                                previewStyles.shopName,
                                { color: config.textColor || "#FFFFFF" },
                                config.fontTheme === "serif" && { fontFamily: "serif" },
                                config.fontTheme === "classic" && { fontFamily: "monospace" },
                            ]}
                        >
                            {config.shopName || "Karatpay"}
                        </Text>
                    )}
                </View>

                {config.showTime && config.brandAlignment === 'left' && (
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={[previewStyles.miniTime, { color: config.textColor || "#FFF" }]}>
                            {formatTime(new Date())}
                        </Text>
                    </View>
                )}
                {config.brandAlignment === 'center' && <View style={{ flex: 1 }} />}
            </View>

            {/* Mini Card */}
            <View
                style={[
                    previewStyles.mainCard,
                    {
                        backgroundColor: config.backgroundColor || "#FFFFFF",
                        borderColor: config.cardBorderColor || "#EEEEEE",
                        borderRadius: config.cardBorderRadius ?? 16,
                        borderWidth: config.cardBorderWidth ?? 1,
                    },
                    config.theme === "glass" && previewStyles.glassCard,
                    config.theme === "modern" && previewStyles.modernCard,
                ]}
            >
                {/* Reference Header in Preview */}
                <View style={previewStyles.miniCardHeaderTextRow}>
                    <Text style={previewStyles.miniLiveGoldText}>Live Gold Price</Text>
                </View>

                {config.logoBase64 && config.logoPlacement === 'card' && (
                    <Image
                        source={{ uri: config.logoBase64 }}
                        style={{
                            width: config.logoSize * 0.8,
                            height: config.logoSize * 0.8,
                            alignSelf: 'center',
                            marginBottom: 10,
                            opacity: config.logoOpacity
                        }}
                        resizeMode="contain"
                    />
                )}

                {config.showGold24k && (
                    <View style={previewStyles.rateRow}>
                        <Text style={[previewStyles.label, { color: config.textColor || "#FFF" }]}>{config.gold24kLabel}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[previewStyles.price, { color: config.priceColor || GOLD }]}>
                                {formatPrice(sampleRates.gold24k)}
                            </Text>
                            <View style={previewStyles.miniChange}>
                                <Text style={{ color: '#00E676', fontSize: 10 }}>↑ ₹45</Text>
                            </View>
                        </View>
                    </View>
                )}

                {config.showGold22k && (
                    <View style={previewStyles.rateRow}>
                        <Text style={[previewStyles.label, { color: config.textColor || "#FFF" }]}>{config.gold22kLabel}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[previewStyles.price, { color: config.priceColor || GOLD }]}>
                                {formatPrice(sampleRates.gold22k)}
                            </Text>
                            <View style={previewStyles.miniChange}>
                                <Text style={{ color: '#FF5252', fontSize: 10 }}>↓ ₹32</Text>
                            </View>
                        </View>
                    </View>
                )}

                {(config.showGold24k || config.showGold22k) && (config.showSilver999 || config.showSilver925) && (
                    <View style={previewStyles.divider} />
                )}

                {config.showSilver999 && (
                    <View style={previewStyles.rateRow}>
                        <Text style={[previewStyles.label, { color: config.textColor || "#FFF" }]}>{config.silver999Label}</Text>
                        <Text style={[previewStyles.price, { color: config.priceColor || GOLD }]}>
                            {formatPrice(sampleRates.silver999)}
                        </Text>
                    </View>
                )}

                {config.showSilver925 && (
                    <View style={previewStyles.rateRow}>
                        <Text style={[previewStyles.label, { color: config.textColor || "#FFF" }]}>{config.silver925Label}</Text>
                        <Text style={[previewStyles.price, { color: config.priceColor || GOLD }]}>
                            {formatPrice(sampleRates.silver925)}
                        </Text>
                    </View>
                )}
            </View>

            <Text style={previewStyles.previewLabel}>LIVE PREVIEW</Text>
        </View>
    );
};

// ====== Styles ======
const tabsStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "transparent",
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 4,
        gap: 6,
        borderWidth: 1,
        borderColor: "#EEEEEE",
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    activeTab: {
        backgroundColor: GOLD,
        shadowColor: GOLD,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    tabContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    icon: {
        marginRight: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    activeTabText: {
        color: "#000",
        fontWeight: "700",
    },
});

const previewStyles = StyleSheet.create({
    previewContainer: {
        width: '120%',
        alignSelf: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF', // White background for the preview area
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginVertical: -30,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    miniHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    brandingContainer: {
        flex: 2,
    },
    miniTime: {
        fontSize: 10,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainCard: {
        padding: 15,
        borderWidth: 1,
    },
    miniCardHeaderTextRow: {
        marginBottom: 10,
    },
    miniLiveGoldText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#D4AF37",
    },
    glassCard: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    modernCard: {
        borderColor: GOLD,
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    miniChange: {
        marginLeft: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: '#F9F9F9',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 8,
    },
    previewLabel: {
        textAlign: 'center',
        color: GOLD,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginTop: 15,
        opacity: 0.7,
    }
});
