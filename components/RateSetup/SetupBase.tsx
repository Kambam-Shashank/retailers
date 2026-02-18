import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { RateConfig } from "@/contexts/RateConfigContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";

// ====== RateSetupTabs ======
export type TabType = "profile" | "rates" | "visual";

interface RateSetupTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    isMobile?: boolean;
}

export const RateSetupTabs: React.FC<RateSetupTabsProps> = ({ activeTab, onTabChange, isMobile }) => {
    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: "profile", label: "Branding", icon: "storefront" },
        { id: "rates", label: "Rates", icon: "currency-inr" },
        { id: "visual", label: "Visual", icon: "palette-outline" },
    ];

    return (
        <View style={tabStyles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tabStyles.scroll}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        style={[tabStyles.tab, activeTab === tab.id && tabStyles.activeTab]}
                    >
                        <MaterialCommunityIcons
                            name={tab.icon}
                            size={isMobile ? 18 : 20}
                            color={activeTab === tab.id ? "#000" : "#666"}
                        />
                        <Text style={[tabStyles.label, activeTab === tab.id && tabStyles.activeLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// ====== LivePreview ======
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

export const LivePreview: React.FC<{ config: RateConfig }> = ({ config }) => {
    const [withGST, setWithGST] = useState(true);

    const calculatedMockRates = React.useMemo(() => {
        const rates: any = {};
        const GST_RATE = 0.03;

        const roundTo = (num: number, multiple: number) => {
            if (multiple === 0) return num;
            return Math.round(num / multiple) * multiple;
        };

        const keys: (keyof typeof MOCK_BASE_RATES)[] = [
            "gold999", "gold916", "gold20k", "gold18k", "gold14k", "silver999", "silver925"
        ];

        keys.forEach(key => {
            const base = MOCK_BASE_RATES[key];
            const isSilver = key.startsWith('silver');

            // Apply margin
            const marginKey = key === "gold916" ? "gold22kMargin" : (key + "Margin") as keyof RateConfig;
            const margin = (config as any)[marginKey] || 0;
            const withMargin = roundTo(base + margin, isSilver ? 10 : 50);

            // Apply GST
            const withGSTPrice = withGST ? withMargin * (1 + GST_RATE) : withMargin;

            // Apply Making Charges
            let mc = 0;
            if (config.makingChargesEnabled) {
                const mcKeyPrefix = key === "gold916" ? "22k" : key === "gold999" ? "24k" : key.replace('gold', '').replace('silver', '');
                const mcTypeKey = `makingCharges${mcKeyPrefix}Type` as keyof RateConfig;
                const mcValueKey = `makingCharges${mcKeyPrefix}Value` as keyof RateConfig;

                if (config[mcTypeKey] === "percentage") {
                    mc = withGSTPrice * (Number(config[mcValueKey] || 0) / 100);
                } else {
                    mc = Number(config[mcValueKey] || 0);
                }
            }

            rates[key] = {
                basePrice: base,
                finalPrice: withGSTPrice + mc,
                makingCharges: mc
            };
        });

        return rates;
    }, [config, withGST]);

    return (
        <View style={previewStyles.container}>
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
                    />
                </View>
            </View>
        </View>
    );
};

const tabStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
        backgroundColor: "#FFF",
        height: 60,
        width: '100%',
    },
    scroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 12,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        gap: 6,
        height: 40,
    },
    activeTab: { backgroundColor: GOLD },
    label: { fontSize: 13, fontWeight: "600", color: "#666" },
    activeLabel: { color: "#000" },
});

const previewStyles = StyleSheet.create({
    container: { backgroundColor: "#F8FAF8", borderRadius: 20, borderWidth: 1, borderColor: "#E2E8E2", marginHorizontal: 16, marginTop: 10, marginBottom: 8, padding: 4, elevation: 3 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, paddingHorizontal: 6, marginTop: 4 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 },
    title: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    content: { backgroundColor: "#FFFFFF", borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', margin: 2 },
    wrapper: { width: "100%", minHeight: 180, overflow: "hidden" },
});
