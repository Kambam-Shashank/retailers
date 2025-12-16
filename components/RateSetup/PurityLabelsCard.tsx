import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const GOLD = "#D4AF37";
const CARD_DARK = "#121212";
const GOLD_SOFT = "#D4AF3733";
const TEXT_MUTED = "#A1A1A1";

const DEFAULT_LABELS = {
    gold24k: "24K Gold (999)",
    gold22k: "22K Gold (916)",
    silver999: "Silver (999)",
    silver925: "Silver (925)",
};

interface PurityLabelsCardProps {
    gold24kLabel: string;
    gold22kLabel: string;
    silver999Label: string;
    silver925Label: string;
    isDesktop: boolean;
    onLabelChange: (key: string, value: string) => void;
    onLabelsBlur: () => void;
}

export const PurityLabelsCard: React.FC<PurityLabelsCardProps> = ({
    gold24kLabel,
    gold22kLabel,
    silver999Label,
    silver925Label,
    isDesktop,
    onLabelChange,
    onLabelsBlur,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Custom Purity Labels</Text>
            <Text style={styles.cardSubtitle}>
                Customize how each metal category is displayed
            </Text>

            <View style={[styles.purityRow, isDesktop && styles.rowDesktop]}>
                <View style={[styles.purityField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>24K Gold (999)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={DEFAULT_LABELS.gold24k}
                            placeholderTextColor="#A3A3A3"
                            style={[styles.textInput, { outlineStyle: "none" } as any]}
                            value={gold24kLabel}
                            onChangeText={(text) => onLabelChange("gold24kLabel", text)}
                            onBlur={onLabelsBlur}
                        />
                    </View>
                </View>

                <View style={[styles.purityField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>22K Gold (916)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={DEFAULT_LABELS.gold22k}
                            placeholderTextColor="#A3A3A3"
                            style={[styles.textInput, { outlineStyle: "none" } as any]}
                            value={gold22kLabel}
                            onChangeText={(text) => onLabelChange("gold22kLabel", text)}
                            onBlur={onLabelsBlur}
                        />
                    </View>
                </View>
            </View>

            <View style={[styles.purityRow, isDesktop && styles.rowDesktop]}>
                <View style={[styles.purityField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>Silver (999)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={DEFAULT_LABELS.silver999}
                            placeholderTextColor="#A3A3A3"
                            style={[styles.textInput, { outlineStyle: "none" } as any]}
                            value={silver999Label}
                            onChangeText={(text) => onLabelChange("silver999Label", text)}
                            onBlur={onLabelsBlur}
                        />
                    </View>
                </View>

                <View style={[styles.purityField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>Silver (925)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            placeholder={DEFAULT_LABELS.silver925}
                            placeholderTextColor="#A3A3A3"
                            style={[styles.textInput, { outlineStyle: "none" } as any]}
                            value={silver925Label}
                            onChangeText={(text) => onLabelChange("silver925Label", text)}
                            onBlur={onLabelsBlur}
                        />
                    </View>
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
        color: GOLD,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginBottom: 24,
    },
    purityRow: {
        flexDirection: "column",
        marginBottom: 8,
    },
    purityField: {
        width: "100%",
        marginBottom: 20,
    },
    rowDesktop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    fieldDesktop: {
        flex: 1,
        width: "auto",
        marginBottom: 0,
        marginRight: 16,
    },
    labelRowTitle: {
        fontSize: 13,
        color: TEXT_MUTED,
        fontWeight: "600",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: "#161616",
    },
    textInput: {
        color: "#fff",
        fontSize: 15,
        paddingVertical: 10,
    },
});
