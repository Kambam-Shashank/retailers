import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

interface SuccessToastProps {
    fadeAnim: Animated.Value;
    translateY: Animated.Value;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ fadeAnim, translateY }) => {
    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                },
            ]}
            pointerEvents="none"
        >
            <View style={styles.toastContent}>
                <View style={styles.toastIconContainer}>
                    <Text style={styles.toastIcon}>✔</Text>
                </View>
                <View>
                    <Text style={styles.toastTitle}>Success</Text>
                    <Text style={styles.toastMessage}>
                        Configuration saved successfully
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        top: 80,
        left: 20,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        elevation: 1000,
    },
    toastContent: {
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: GOLD,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: 400,
        width: "100%",
    },
    toastIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(212, 175, 55, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    toastIcon: {
        color: GOLD,
        fontSize: 16,
        fontWeight: "bold",
    },
    toastTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    toastMessage: {
        color: TEXT_MUTED,
        fontSize: 12,
    },
});
