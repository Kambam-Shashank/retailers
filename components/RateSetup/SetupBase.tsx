import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { useAuth } from "@/contexts/AuthContext";
import { RateConfig } from "@/contexts/RateConfigContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";

// ====== RateSetupTabs ======
export type TabType = "profile" | "rates" | "visual" | "catalog";

interface RateSetupTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    isMobile?: boolean;
}

export const RateSetupTabs: React.FC<RateSetupTabsProps> = ({ activeTab, onTabChange, isMobile }) => {
    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: "profile", label: "Profile", icon: "store-outline" },
        { id: "rates", label: "Rates", icon: "chart-line-variant" },
        { id: "visual", label: "Theme", icon: "palette-outline" },
        { id: "catalog", label: "Catalogue", icon: "share-variant-outline" },
    ];

    return (
        <View style={tabStyles.outerContainer}>
            <View style={tabStyles.container}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => onTabChange(tab.id)}
                            style={[tabStyles.tab, isActive && tabStyles.activeTab]}
                        >
                            <MaterialCommunityIcons
                                name={tab.icon}
                                size={isMobile ? 16 : 20}
                                color={isActive ? "#1E293B" : "#94A3B8"}
                            />
                            <Text style={[
                                tabStyles.label,
                                isActive && tabStyles.activeLabel,
                                isMobile && { fontSize: 10 }
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const MOCK_BASE_RATES = {
    gold999: 138255,
    gold916: 126650,
    gold20k: 115212,
    gold18k: 103691,
    gold14k: 80602,
    silver999: 2370,
    silver925: 2192,
};

const MOCK_PRICE_CHANGE = { hasChanged: false, isIncrease: false, isDecrease: false, change: 0, previousPrice: 0, percentageChange: 0 };

export const LivePreview: React.FC<{ config: RateConfig; isMobile?: boolean }> = ({ config, isMobile }) => {
    const [withGST, setWithGST] = useState(true);
    const { user } = useAuth();

    const calculatedMockRates = React.useMemo(() => {
        const rates: any = {};
        const GST_RATE = 0.03;

        const keys: (keyof typeof MOCK_BASE_RATES)[] = [
            "gold999", "gold916", "gold20k", "gold18k", "gold14k", "silver999", "silver925"
        ];

        keys.forEach(key => {
            const base = MOCK_BASE_RATES[key];

            const marginKey = key === "gold916" ? "gold22kMargin" : (key + "Margin") as keyof RateConfig;
            const margin = (config as any)[marginKey] || 0;
            const withMargin = base + margin;

            const withGSTPrice = withGST ? withMargin * (1 + GST_RATE) : withMargin;

            let mc = 0;
            if (config.makingChargesEnabled) {
                const mcKeyPrefix = key === "gold916" ? "22k" : key === "gold999" ? "24k" : key.replace('gold', '').replace('silver', '');
                const mcTypeKey = `makingCharges${mcKeyPrefix}Type` as keyof RateConfig;
                const mcValueKey = `makingCharges${mcKeyPrefix}Value` as keyof RateConfig;

                if (config[mcTypeKey] === "percentage") {
                    mc = withGSTPrice * (Number(config[mcValueKey] || 0) / 100);
                } else {
                    mc = Number(config[mcValueKey] || 0) * 10;
                }
            }

            rates[key] = {
                basePrice: base,
                priceWithGST: withGSTPrice,
                finalPrice: withGSTPrice + mc,
                makingCharges: mc
            };
        });

        return rates;
    }, [config, withGST]);

    return (
        <View style={[previewStyles.container, { padding: isMobile ? 12 : 24 }]}>
            <View style={previewStyles.header}>
                <View style={previewStyles.dot} />
                <Text style={previewStyles.title}>Live Preview</Text>
            </View>
            <View style={previewStyles.content}>
                <View style={[previewStyles.wrapper, { backgroundColor: config.backgroundColor || "#FFFFFF" }]}>
                    <RateDisplayContent
                        config={config}
                        calculatedRates={calculatedMockRates}
                        currentTime={new Date()}
                        viewOnly={true}
                        previewMode={true}
                        withGST={withGST}
                        onToggleGST={() => setWithGST(!withGST)}
                        onShare={() => { }}
                        shareUrl="https://karatpay-retailers.vercel.app"
                        gold999Change={MOCK_PRICE_CHANGE}
                        gold916Change={MOCK_PRICE_CHANGE}
                        silver999Change={MOCK_PRICE_CHANGE}
                        silver925Change={MOCK_PRICE_CHANGE}
                        retailerId={user?.uid}
                    />
                </View>
            </View>
        </View>
    );
};

const tabStyles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        padding: 4,
        gap: 6,
        alignSelf: 'center',
        minWidth: 320,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4,
    },
    activeTab: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: { fontSize: 12, fontWeight: "600", color: "#64748B" },
    activeLabel: { color: "#1E293B" },
});

const previewStyles = StyleSheet.create({
    container: { backgroundColor: "#FFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", marginTop: 8, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 0 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 10 },
    title: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    content: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
    wrapper: { width: "100%", minHeight: 400, overflow: "hidden" },
});
