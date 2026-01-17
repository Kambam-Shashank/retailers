import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { RateConfig } from "@/contexts/RateConfigContext";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// Mock data for preview
const MOCK_RATES = {
    gold999: { basePrice: 138255, finalPrice: 138255, priceWithGST: 142422, priceWithMargin: 138255 },
    gold916: { basePrice: 126650, finalPrice: 126650, priceWithGST: 130409, priceWithMargin: 126650 },
    gold20k: { basePrice: 115212, finalPrice: 115212, priceWithGST: 118668, priceWithMargin: 115212 },
    gold18k: { basePrice: 103691, finalPrice: 103691, priceWithGST: 106801, priceWithMargin: 103691 },
    gold14k: { basePrice: 80602, finalPrice: 80602, priceWithGST: 83020, priceWithMargin: 80602 },
    silver999: { basePrice: 2370, finalPrice: 2370, priceWithGST: 2441, priceWithMargin: 2370, makingCharges: 0 },
    silver925: { basePrice: 2192, finalPrice: 2192, priceWithGST: 2257, priceWithMargin: 2192, makingCharges: 0 },
};

const MOCK_PRICE_CHANGE = {
    hasChanged: false,
    isIncrease: false,
    isDecrease: false,
    change: 0,
    previousPrice: 0,
    percentageChange: 0,
};

interface LivePreviewProps {
    config: RateConfig;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ config }) => {
    const [withGST, setWithGST] = useState(true);

    return (
        <View style={styles.previewContainer}>
            <View style={styles.outerHeader}>
                <View style={styles.outerDot} />
                <Text style={styles.outerTitle}>Live Preview</Text>
            </View>

            <View style={styles.previewContent}>
                <View style={styles.innerHeader}>
                    <View style={styles.innerDot} />
                    <Text style={styles.innerTitle}>LIVE PREVIEW</Text>
                </View>

                <View
                    style={[
                        styles.previewWrapper,
                        { backgroundColor: config.backgroundColor || "#FFFFFF" }
                    ]}
                >
                    <RateDisplayContent
                        config={config}
                        calculatedRates={MOCK_RATES}
                        currentTime={new Date()}
                        viewOnly={true}
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

const styles = StyleSheet.create({
    previewContainer: {
        backgroundColor: "#F8FAF8",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E2E8E2",
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    outerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    outerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22C55E',
        marginRight: 8,
    },
    outerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    previewContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    innerHeader: {
        backgroundColor: '#E2E8CE',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D1D8BE',
    },
    innerDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
        marginRight: 8,
    },
    innerTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    previewWrapper: {
        width: "100%",
        minHeight: 380,
        overflow: "hidden",
    },
});
