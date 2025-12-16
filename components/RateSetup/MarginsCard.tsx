import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const CARD_DARK = "#121212";
const GOLD_SOFT = "#D4AF3733";
const TEXT_MUTED = "#A1A1A1";

interface MarginsCardProps {
    gold24kMargin: number;
    gold22kMargin: number;
    silver999Margin: number;
    silver925Margin: number;
    isDesktop: boolean;
    onMarginUpdate: (key: string, value: number) => void;
    onMarginInputChange: (key: string, text: string) => void;
}

export const MarginsCard: React.FC<MarginsCardProps> = ({
    gold24kMargin,
    gold22kMargin,
    silver999Margin,
    silver925Margin,
    isDesktop,
    onMarginUpdate,
    onMarginInputChange,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Margins</Text>
            <Text style={styles.cardSubtitle}>
                Set your profit margin for each metal category
            </Text>
            <View style={[styles.marginRow, isDesktop && styles.rowDesktop]}>
                <View style={[styles.marginField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>24K Gold (999)</Text>
                    <View style={styles.marginControlRow}>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("gold24kMargin", gold24kMargin - 50)}
                        >
                            <Text style={styles.adjustButtonText}>−</Text>
                        </TouchableOpacity>

                        <View style={styles.marginValueBox}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={[styles.marginValueText, { outlineStyle: "none" } as any]}
                                keyboardType="numeric"
                                value={String(gold24kMargin)}
                                onChangeText={(t) => onMarginInputChange("gold24kMargin", t)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("gold24kMargin", gold24kMargin + 50)}
                        >
                            <Text style={styles.adjustButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.unitText}>per 10g</Text>
                </View>

                <View style={[styles.marginField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>22K Gold (916)</Text>
                    <View style={styles.marginControlRow}>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("gold22kMargin", gold22kMargin - 50)}
                        >
                            <Text style={styles.adjustButtonText}>−</Text>
                        </TouchableOpacity>

                        <View style={styles.marginValueBox}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={[styles.marginValueText, { outlineStyle: "none" } as any]}
                                keyboardType="numeric"
                                value={String(gold22kMargin)}
                                onChangeText={(t) => onMarginInputChange("gold22kMargin", t)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("gold22kMargin", gold22kMargin + 50)}
                        >
                            <Text style={styles.adjustButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.unitText}>per 10g</Text>
                </View>
            </View>

            {/* Silver margins */}
            <View style={[styles.marginRow, isDesktop && styles.rowDesktop]}>
                <View style={[styles.marginField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>Silver (999)</Text>
                    <View style={styles.marginControlRow}>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("silver999Margin", silver999Margin - 1)}
                        >
                            <Text style={styles.adjustButtonText}>−</Text>
                        </TouchableOpacity>

                        <View style={styles.marginValueBox}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={[styles.marginValueText, { outlineStyle: "none" } as any]}
                                keyboardType="numeric"
                                value={String(silver999Margin)}
                                onChangeText={(t) => onMarginInputChange("silver999Margin", t)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("silver999Margin", silver999Margin + 1)}
                        >
                            <Text style={styles.adjustButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.unitText}>per gram</Text>
                </View>

                <View style={[styles.marginField, isDesktop && styles.fieldDesktop]}>
                    <Text style={styles.labelRowTitle}>Silver (925)</Text>
                    <View style={styles.marginControlRow}>
                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("silver925Margin", silver925Margin - 1)}
                        >
                            <Text style={styles.adjustButtonText}>−</Text>
                        </TouchableOpacity>

                        <View style={styles.marginValueBox}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={[styles.marginValueText, { outlineStyle: "none" } as any]}
                                keyboardType="numeric"
                                value={String(silver925Margin)}
                                onChangeText={(t) => onMarginInputChange("silver925Margin", t)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.adjustButton}
                            onPress={() => onMarginUpdate("silver925Margin", silver925Margin + 1)}
                        >
                            <Text style={styles.adjustButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.unitText}>per gram</Text>
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
    marginRow: {
        flexDirection: "column",
        marginBottom: 8,
    },
    marginField: {
        width: "100%",
        marginBottom: 24,
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
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    marginControlRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    adjustButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
    },
    adjustButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "400",
        lineHeight: 22,
    },
    marginValueBox: {
        flex: 1,
        marginHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#0A0A0A",
        borderWidth: 1,
        borderColor: "#222",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    currencySymbol: {
        color: GOLD,
        fontSize: 16,
        fontWeight: "600",
        marginRight: 6,
    },
    marginValueText: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        paddingVertical: 0,
    },
    unitText: {
        marginTop: 6,
        fontSize: 12,
        color: TEXT_MUTED,
        textAlign: "center",
    },
});
