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
const MOCK_RATES = {
    gold999: { basePrice: 138255, finalPrice: 138255, priceWithGST: 142422, priceWithMargin: 138255 },
    gold916: { basePrice: 126650, finalPrice: 126650, priceWithGST: 130409, priceWithMargin: 126650 },
    gold20k: { basePrice: 115212, finalPrice: 115212, priceWithGST: 118668, priceWithMargin: 115212 },
    gold18k: { basePrice: 103691, finalPrice: 103691, priceWithGST: 106801, priceWithMargin: 103691 },
    gold14k: { basePrice: 80602, finalPrice: 80602, priceWithGST: 83020, priceWithMargin: 80602 },
    silver999: { basePrice: 2370, finalPrice: 2370, priceWithGST: 2441, priceWithMargin: 2370, makingCharges: 0 },
    silver925: { basePrice: 2192, finalPrice: 2192, priceWithGST: 2257, priceWithMargin: 2192, makingCharges: 0 },
};

const MOCK_PRICE_CHANGE = { hasChanged: false, isIncrease: false, isDecrease: false, change: 0, previousPrice: 0, percentageChange: 0 };

export const LivePreview: React.FC<{ config: RateConfig }> = ({ config }) => {
    const [withGST, setWithGST] = useState(true);
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
                        calculatedRates={MOCK_RATES}
                        currentTime={new Date()}
                        viewOnly={true}
                        previewMode={true}
                        withGST={withGST}
                        onToggleGST={() => setWithGST(!withGST)}
                        onShare={() => { }}
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
    container: { backgroundColor: "#F8FAF8", borderRadius: 20, borderWidth: 1, borderColor: "#E2E8E2", marginHorizontal: 16, marginTop: 20, marginBottom: 10, padding: 6, elevation: 3 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 6, marginTop: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 8 },
    title: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    content: { backgroundColor: "#FFFFFF", borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', margin: 4 },
    wrapper: { width: "100%", minHeight: 220, overflow: "hidden" },
});
