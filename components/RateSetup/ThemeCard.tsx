import { RateConfig } from "@/contexts/RateConfigContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ThemeCardProps {
    theme: RateConfig["theme"];
    layoutDensity: RateConfig["layoutDensity"];
    onUpdate: (key: keyof RateConfig, value: any) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
    theme,
    layoutDensity,
    onUpdate,
}) => {
    const themes = [
        { id: "modern", label: "Modern" },
        { id: "classic", label: "Classic" },
        { id: "dark", label: "Dark" },
        { id: "glass", label: "Glass" },
    ];

    const densities = [
        { id: "compact", label: "Compact" },
        { id: "normal", label: "Normal" },
        { id: "spacious", label: "Spacious" },
    ];

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Theme & Layout</Text>
            <Text style={styles.cardSubtitle}>
                Customize the visual style and density of the rate board
            </Text>

            {/* THEME SELECTION */}
            <View style={styles.section}>
                <Text style={styles.label}>Visual Theme</Text>
                <View style={styles.buttonGroup}>
                    {themes.map((t) => (
                        <TouchableOpacity
                            key={t.id}
                            style={[
                                styles.optionButton,
                                theme === t.id && styles.optionButtonActive,
                            ]}
                            onPress={() => onUpdate("theme", t.id)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    theme === t.id && styles.optionTextActive,
                                ]}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* DENSITY SELECTION */}
            <View style={styles.section}>
                <Text style={styles.label}>Layout Density</Text>
                <View style={styles.buttonGroup}>
                    {densities.map((d) => (
                        <TouchableOpacity
                            key={d.id}
                            style={[
                                styles.optionButton,
                                layoutDensity === d.id && styles.optionButtonActive,
                            ]}
                            onPress={() => onUpdate("layoutDensity", d.id)}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    layoutDensity === d.id && styles.optionTextActive,
                                ]}
                            >
                                {d.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0F0F0F",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.15)",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#D4AF37",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: "#A1A1A1",
        marginBottom: 18,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#fff",
        marginBottom: 12,
    },
    buttonGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#1F1F1F",
        borderWidth: 1,
        borderColor: "#333",
    },
    optionButtonActive: {
        backgroundColor: "#D4AF37",
        borderColor: "#D4AF37",
    },
    optionText: {
        color: "#A1A1A1",
        fontSize: 14,
        fontWeight: "600",
    },
    optionTextActive: {
        color: "#000",
    },
});
