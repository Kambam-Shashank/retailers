import { useAaravRates } from "@/customHooks/useAaravRates";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const GOLD = "#D4AF37";

export const LiveRatesTicker = () => {
    const { data: rates, error } = useAaravRates();

    if (error) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Live API: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>LIVE API FEED:</Text>
            <View style={styles.rateItem}>
                <Text style={styles.metal}>GOLD (999):</Text>
                <Text style={styles.price}>
                    {rates.gold ? `₹${rates.gold.toLocaleString()}` : "Loading..."}
                </Text>
            </View>
            <View style={styles.rateItem}>
                <Text style={styles.metal}>SILVER:</Text>
                <Text style={styles.price}>
                    {rates.silver
                        ? `₹${rates.silver.toLocaleString()}`
                        : "Loading..."}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        flexWrap: "wrap",
        gap: 12,
    },
    errorContainer: {
        borderColor: "#EF4444",
        backgroundColor: "#2A1010",
    },
    label: {
        color: "#888",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    rateItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metal: {
        color: "#CCC",
        fontSize: 12,
        fontWeight: "600",
    },
    price: {
        color: GOLD,
        fontSize: 13,
        fontWeight: "bold",
        fontVariant: ["tabular-nums"],
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
    },
});
