import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { RateConfig } from "@/contexts/RateConfigContext";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Mock data for preview
const MOCK_RATES = {
    gold999: { basePrice: 138255, finalPrice: 138255, priceWithGST: 142422, priceWithMargin: 138255 },
    gold916: { basePrice: 126650, finalPrice: 126650, priceWithGST: 130409, priceWithMargin: 126650 },
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
            <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>✨ Live Preview</Text>
                <Text style={styles.previewSubtitle}>Changes update instantly</Text>
            </View>

            <View style={styles.previewContent}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
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
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    previewHeader: {
        padding: 12,
        backgroundColor: "#F9F9F9",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#D4AF37",
        marginBottom: 2,
    },
    previewSubtitle: {
        fontSize: 11,
        color: "#666",
    },
    previewContent: {
        backgroundColor: "#F5F5F5",
        height: 300,
    },
    scrollContent: {
        paddingVertical: 16,
        paddingHorizontal: 4,
    },
    previewWrapper: {
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#E0E0E0",
        width: "100%",
        maxWidth: 380,
    },
});
