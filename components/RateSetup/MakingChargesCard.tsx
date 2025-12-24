import { RateConfig } from "@/contexts/RateConfigContext";
import { useRateSetupMakingCharges } from "@/customHooks/useRateSetupMakingCharges";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

interface MakingChargesCardProps {
    config: RateConfig;
    onUpdate: (updates: Partial<RateConfig>) => void;
}

export const MakingChargesCard: React.FC<MakingChargesCardProps> = ({ config: globalConfig, onUpdate }) => {
    const {
        makingChargesEnabled,
        handleToggleMakingCharges,
        handleChangeMakingType,
        handleMakingValueChange,
        handleTitleChange,
        config
    } = useRateSetupMakingCharges(globalConfig, onUpdate);

    const renderPuritySection = (
        key: "24k" | "22k" | "999" | "925",
        label: string,
        color: string
    ) => {
        const typeKey = `makingCharges${key}Type` as keyof RateConfig;
        const valueKey = `makingCharges${key}Value` as keyof RateConfig;
        const titleKey = `makingCharges${key}Title` as keyof RateConfig;

        const currentType = config[typeKey] as string;
        const currentValue = config[valueKey] as number;
        const currentTitle = config[titleKey] as string;

        return (
            <View key={key} style={styles.puritySection}>
                <View style={styles.nameRow}>
                    <Text style={[styles.label, { color, fontWeight: "bold", marginBottom: 0 }]}>{label}</Text>
                    <TextInput
                        style={[styles.nameInput, { color }]}
                        value={currentTitle}
                        onChangeText={(text) => handleTitleChange(key, text)}
                        placeholder="Label (e.g. MC)"
                        placeholderTextColor="#555"
                    />
                </View>

                <View style={styles.radioRow}>
                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleChangeMakingType(key, "percentage")}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioOuter, currentType === "percentage" && styles.radioOuterActive]}>
                            {currentType === "percentage" && <View style={styles.radioInner} />}
                        </View>
                        <Text style={[styles.radioLabel, currentType === "percentage" && styles.radioLabelActive]}>%</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.radioOption}
                        onPress={() => handleChangeMakingType(key, "perGram")}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioOuter, currentType === "perGram" && styles.radioOuterActive]}>
                            {currentType === "perGram" && <View style={styles.radioInner} />}
                        </View>
                        <Text style={[styles.radioLabel, currentType === "perGram" && styles.radioLabelActive]}>/g</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.makingValueRow}>
                    <View style={[styles.inputWrapper, styles.makingInputWrapper]}>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.textInput}
                            value={currentValue === 0 ? "" : String(currentValue)}
                            onChangeText={(text) => handleMakingValueChange(key, text)}
                            placeholder="0"
                            placeholderTextColor="#A3A3A3"
                        />
                    </View>
                    <Text style={styles.makingUnitText}>
                        {currentType === "percentage" ? "%" : "/ gram"}
                    </Text>
                </View>
                <View style={styles.divider} />
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Making Charges</Text>
            <Text style={styles.cardSubtitle}>
                Set individual charges for each metal purity
            </Text>

            <View style={styles.sectionRow}>
                <Text style={styles.label}>Enable Making Charges</Text>
                <TouchableOpacity
                    style={[styles.switchTrack, makingChargesEnabled && styles.switchTrackOn]}
                    onPress={handleToggleMakingCharges}
                    activeOpacity={0.8}
                >
                    <View style={[styles.switchThumb, makingChargesEnabled && styles.switchThumbOn]} />
                </TouchableOpacity>
            </View>

            {makingChargesEnabled && (
                <View style={styles.purityContainer}>
                    {renderPuritySection("24k", "24K Gold", GOLD)}
                    {renderPuritySection("22k", "22K Gold", GOLD)}
                    {renderPuritySection("999", "999 Silver", "#C0C0C0")}
                    {renderPuritySection("925", "925 Silver", "#C0C0C0")}
                </View>
            )}
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
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: TEXT_MUTED,
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        color: "#fff",
        marginBottom: 8,
    },
    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    switchTrack: {
        width: 50,
        height: 30,
        borderRadius: 999,
        backgroundColor: "#222",
        padding: 4,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#333",
    },
    switchTrackOn: {
        backgroundColor: GOLD,
    },
    switchThumb: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#111",
        alignSelf: "flex-start",
    },
    switchThumbOn: {
        alignSelf: "flex-end",
        backgroundColor: "#000",
    },
    radioRow: {
        flexDirection: "row",
        marginBottom: 14,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#555",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    radioOuterActive: {
        borderColor: GOLD,
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: GOLD,
    },
    radioLabel: {
        fontSize: 13,
        color: TEXT_MUTED,
    },
    radioLabelActive: {
        color: GOLD,
    },
    makingValueRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: "#161616",
        flexDirection: "row",
        alignItems: "center",
    },
    makingInputWrapper: {
        flex: 0.4,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    nameInput: {
        flex: 1,
        marginLeft: 15,
        color: GOLD,
        fontSize: 14,
        fontWeight: "600",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingVertical: 4,
    },
    textInput: {
        color: "#fff",
        fontSize: 14,
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#222",
        marginVertical: 15,
    },
    purityContainer: {
        marginTop: 10,
    },
    puritySection: {
        marginBottom: 20,
    },
    makingUnitText: {
        color: TEXT_MUTED,
        fontSize: 12,
        marginLeft: 5,
    },
});
