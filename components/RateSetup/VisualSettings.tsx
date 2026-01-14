import { RateConfig } from "@/contexts/RateConfigContext";
import React from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const GOLD_SOFT = "rgba(212, 175, 55, 0.15)";
const TEXT_MUTED = "#A1A1A1";

// ====== ThemeCard ======
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
        <View style={themeStyles.card}>
            <Text style={themeStyles.cardTitle}>Theme & Layout</Text>
            <Text style={themeStyles.cardSubtitle}>
                Customize the visual style and density of the rate board
            </Text>

            <View style={themeStyles.section}>
                <Text style={themeStyles.label}>Visual Theme</Text>
                <View style={themeStyles.themeGrid}>
                    {themes.map((t) => (
                        <TouchableOpacity
                            key={t.id}
                            style={[
                                themeStyles.themePreviewCard,
                                theme === t.id && themeStyles.themePreviewCardActive,
                            ]}
                            onPress={() => onUpdate("theme", t.id)}
                        >
                            <View style={themeStyles.themePreviewImageWrapper}>
                                <View
                                    style={[
                                        themeStyles.themePreviewPlaceholder,
                                        t.id === "modern" && { backgroundColor: "#111", borderColor: "#D4AF37" },
                                        t.id === "classic" && { backgroundColor: "#FFF", borderColor: "#CCC" },
                                        t.id === "glass" && { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" },
                                        t.id === "dark" && { backgroundColor: "#1A1A1A", borderColor: "#333" },
                                    ]}
                                >
                                    <View style={themeStyles.themeSampleLine} />
                                    <View style={themeStyles.themeSampleLine} />
                                </View>
                            </View>
                            <Text
                                style={[
                                    themeStyles.themePreviewLabel,
                                    theme === t.id && themeStyles.themePreviewLabelActive,
                                ]}
                            >
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={themeStyles.section}>
                <Text style={themeStyles.label}>Layout Density</Text>
                <View style={themeStyles.buttonGroup}>
                    {densities.map((d) => (
                        <TouchableOpacity
                            key={d.id}
                            style={[
                                themeStyles.optionButton,
                                layoutDensity === d.id && themeStyles.optionButtonActive,
                            ]}
                            onPress={() => onUpdate("layoutDensity", d.id)}
                        >
                            <Text
                                style={[
                                    themeStyles.optionText,
                                    layoutDensity === d.id && themeStyles.optionTextActive,
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

// ====== DisplayCustomizationCard ======
interface DisplayCustomizationCardProps {
    fontTheme: "modern" | "classic" | "serif";
    cardStyle: "boxed" | "minimal";
    showTime: boolean;
    showShopName: boolean;
    showDate: boolean;
    brandAlignment?: "left" | "center" | "right";
    showGold24k: boolean;
    showGold22k: boolean;
    showSilver999: boolean;
    showSilver925: boolean;
    priceDecimalPlaces: 0 | 1 | 2;
    onUpdate: (key: string, value: any) => void;
}

export const DisplayCustomizationCard: React.FC<DisplayCustomizationCardProps> = ({
    fontTheme,
    cardStyle,
    showTime,
    showShopName,
    showDate,
    brandAlignment = "center",
    showGold24k,
    showGold22k,
    showSilver999,
    showSilver925,
    priceDecimalPlaces,
    onUpdate,
}) => {
    return (
        <View style={displayStyles.card}>
            <Text style={displayStyles.cardTitle}>Display Options</Text>
            <Text style={displayStyles.cardSubtitle}>
                Customize header and branding settings
            </Text>

            <View style={displayStyles.section}>
                <Text style={displayStyles.sectionTitle}>Price Formatting</Text>
                <View style={displayStyles.row}>
                    {[0, 1, 2].map((digits) => (
                        <TouchableOpacity
                            key={digits}
                            style={[
                                displayStyles.optionButton,
                                priceDecimalPlaces === digits && displayStyles.optionButtonActive,
                            ]}
                            onPress={() => onUpdate("priceDecimalPlaces", digits)}
                        >
                            <Text
                                style={[
                                    displayStyles.optionText,
                                    priceDecimalPlaces === digits && displayStyles.optionTextActive,
                                ]}
                            >
                                {digits} Decimal{digits !== 1 ? "s" : ""}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

        </View>
    );
};

// ====== ColorCustomizationCard ======
const THEME_PRESETS = [
    { name: "Classic Gold", bg: "#FFFDF5", text: "#5D4037", price: "#E6A119", cardBg: "#FFFFFF" },
    { name: "Royal Blue", bg: "#F0F9FF", text: "#1E3A8A", price: "#3B82F6", cardBg: "#FFFFFF" },
    { name: "Modern Dark", bg: "#0F172A", text: "#F8FAFC", price: "#94A3B8", cardBg: "#1E293B" },
    { name: "Fresh Green", bg: "#F0FDF4", text: "#14532D", price: "#22C55E", cardBg: "#FFFFFF" },
    { name: "Rose Gold", bg: "#FFF1F2", text: "#881337", price: "#E11D48", cardBg: "#FFFFFF" },
    { name: "Midnight", bg: "#1E1B4B", text: "#E0E7FF", price: "#818CF8", cardBg: "#312E81" },
    { name: "Sunset", bg: "#FFF7ED", text: "#7C2D12", price: "#F97316", cardBg: "#FFFFFF" },
    { name: "Ocean", bg: "#F0FDFA", text: "#134E4A", price: "#0D9488", cardBg: "#FFFFFF" },
    { name: "Lavender", bg: "#F5F3FF", text: "#4C1D95", price: "#8B5CF6", cardBg: "#FFFFFF" },
];

interface ColorCustomizationCardProps {
    backgroundColor: string;
    textColor: string;
    priceColor: string;
    onColorChange: (key: string, value: string) => void;
}

export const ColorCustomizationCard: React.FC<ColorCustomizationCardProps> = ({
    backgroundColor,
    textColor,
    priceColor,
    onColorChange,
}) => {
    const handleRandomize = () => {
        const palettes = [
            { bg: "#050505", text: "#F5F5F5", price: "#FFD700" },
            { bg: "#111827", text: "#E5E7EB", price: "#F59E0B" },
            { bg: "#022C22", text: "#D1FAE5", price: "#34D399" },
            { bg: "#1E1B4B", text: "#E0E7FF", price: "#A855F7" },
            { bg: "#312E81", text: "#E5E7EB", price: "#F97316" },
        ];
        const pick = palettes[Math.floor(Math.random() * palettes.length)];
        onColorChange("backgroundColor", pick.bg);
        onColorChange("textColor", pick.text);
        onColorChange("priceColor", pick.price);
    };

    return (
        <View style={colorStyles.card}>
            <Text style={colorStyles.cardTitle}>Display Colors</Text>
            <Text style={colorStyles.cardSubtitle}>
                Customize the colors for your rate display board
            </Text>

            <View style={colorStyles.colorRow}>
                <View style={colorStyles.colorInfo}>
                    <Text style={colorStyles.label}>Background Color</Text>
                    <View style={colorStyles.inputRow}>
                        <View style={colorStyles.inputWrapper}>
                            <TextInput
                                placeholder="#000000"
                                placeholderTextColor="#A3A3A3"
                                style={[colorStyles.textInput, { outlineStyle: "none" } as any]}
                                value={backgroundColor}
                                onChangeText={(text) => onColorChange("backgroundColor", text)}
                                maxLength={7}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={[colorStyles.colorPreview, { backgroundColor: backgroundColor }]} />
                    </View>
                </View>
            </View>

            <View style={colorStyles.colorRow}>
                <View style={colorStyles.colorInfo}>
                    <Text style={colorStyles.label}>Text Color</Text>
                    <View style={colorStyles.inputRow}>
                        <View style={colorStyles.inputWrapper}>
                            <TextInput
                                placeholder="#FFFFFF"
                                placeholderTextColor="#A3A3A3"
                                style={[colorStyles.textInput, { outlineStyle: "none" } as any]}
                                value={textColor}
                                onChangeText={(text) => onColorChange("textColor", text)}
                                maxLength={7}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={[colorStyles.colorPreview, { backgroundColor: textColor }]} />
                    </View>
                </View>
            </View>

            <View style={colorStyles.colorRow}>
                <View style={colorStyles.colorInfo}>
                    <Text style={colorStyles.label}>Price Color</Text>
                    <View style={colorStyles.inputRow}>
                        <View style={colorStyles.inputWrapper}>
                            <TextInput
                                placeholder="#D4AF37"
                                placeholderTextColor="#A3A3A3"
                                style={[colorStyles.textInput, { outlineStyle: "none" } as any]}
                                value={priceColor}
                                onChangeText={(text) => onColorChange("priceColor", text)}
                                maxLength={7}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={[colorStyles.colorPreview, { backgroundColor: priceColor }]} />
                    </View>
                </View>
            </View>

            <View style={colorStyles.presetsSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 24, marginRight: 8 }}>🎨</Text>
                    <Text style={colorStyles.presetsTitle}>Theme Presets</Text>
                </View>
                <Text style={colorStyles.presetsSubtitle}>Choose a preset theme for your display</Text>

                <View style={colorStyles.presetsGrid}>
                    {THEME_PRESETS.map((p) => {
                        const isActive = backgroundColor === p.bg && textColor === p.text && priceColor === p.price;
                        return (
                            <TouchableOpacity
                                key={p.name}
                                style={[
                                    colorStyles.presetCard,
                                    { backgroundColor: p.bg },
                                    isActive && { borderColor: GOLD, borderWidth: 2 }
                                ]}
                                onPress={() => {
                                    onColorChange("backgroundColor", p.bg);
                                    onColorChange("textColor", p.text);
                                    onColorChange("priceColor", p.price);
                                    onColorChange("cardBackgroundColor", p.cardBg);
                                }}
                            >
                                <Text style={[colorStyles.presetCardName, { color: p.text }]}>{p.name}</Text>
                                <View style={colorStyles.colorDotsRow}>
                                    <View style={[colorStyles.colorDot, { backgroundColor: p.text }]} />
                                    <View style={[colorStyles.colorDot, { backgroundColor: p.price, opacity: 0.6 }]} />
                                    <View style={[colorStyles.colorDot, { backgroundColor: p.cardBg, borderColor: '#DDD', borderWidth: 1 }]} />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity style={colorStyles.randomButton} onPress={handleRandomize}>
                    <Text style={colorStyles.randomText}>Random Theme</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ====== CardStyleCard ======
interface CardStyleCardProps {
    cardBorderRadius?: number;
    cardBorderColor?: string;
    onUpdate: (updates: Partial<RateConfig>) => void;
}

export const CardStyleCard: React.FC<CardStyleCardProps> = ({
    cardBorderRadius,
    cardBorderColor,
    onUpdate,
}) => {
    return (
        <View style={styleCardStyles.card}>
            <Text style={styleCardStyles.cardTitle}>Card Background & Border</Text>
            <Text style={styleCardStyles.cardSubtitle}>
                Fine-tune the look of your rate card
            </Text>

            <View style={styleCardStyles.sectionRow}>
                <Text style={styleCardStyles.label}>Corner Roundness</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    {[0, 16, 24].map((radius) => (
                        <TouchableOpacity
                            key={radius}
                            onPress={() => onUpdate({ cardBorderRadius: radius })}
                            style={[
                                styleCardStyles.radioOption,
                                cardBorderRadius === radius && { backgroundColor: GOLD, borderColor: GOLD }
                            ]}
                        >
                            <Text style={{ color: cardBorderRadius === radius ? "#000" : "#666", fontWeight: "600" }}>
                                {radius === 0 ? "Square" : `${radius}px`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={[styleCardStyles.sectionRow, { marginTop: 20 }]}>
                <Text style={styleCardStyles.label}>Border Color</Text>
                <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                    {["#333333", "#FFFFFF", "#D4AF37", "transparent"].map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => onUpdate({ cardBorderColor: color })}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: color === "transparent" ? "#000" : color,
                                borderWidth: 2,
                                borderColor: cardBorderColor === color ? "#4CAF50" : "#555",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            {color === "transparent" && (
                                <View style={{ width: 30, height: 2, backgroundColor: "red", transform: [{ rotate: "45deg" }] }} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

// ====== Styles ======
const themeStyles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#1A1A1A",
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
        backgroundColor: "#F9F9F9",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    optionButtonActive: {
        backgroundColor: GOLD,
        borderColor: GOLD,
    },
    optionText: {
        color: "#666",
        fontSize: 14,
        fontWeight: "600",
    },
    optionTextActive: {
        color: "#000",
    },
    // Theme preview styles
    themeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 8,
    },
    themePreviewCard: {
        width: "47%",
        minWidth: 140,
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E0E0E0",
        padding: 12,
        alignItems: "center",
    },
    themePreviewCardActive: {
        borderColor: GOLD,
        backgroundColor: GOLD_SOFT,
    },
    themePreviewImageWrapper: {
        width: "100%",
        aspectRatio: 1.5,
        marginBottom: 8,
        borderRadius: 8,
        overflow: "hidden",
    },
    themePreviewPlaceholder: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
        justifyContent: "center",
        gap: 12,
    },
    themeSampleLine: {
        height: 8,
        backgroundColor: "rgba(212, 175, 55, 0.3)",
        borderRadius: 4,
    },
    themePreviewLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        textAlign: "center",
    },
    themePreviewLabelActive: {
        color: GOLD,
        fontWeight: "700",
    },
});

const displayStyles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: GOLD,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        color: "#1A1A1A",
        fontWeight: "600",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    optionButtonActive: {
        backgroundColor: GOLD,
        borderColor: GOLD,
    },
    optionText: {
        color: "#666",
        fontSize: 14,
    },
    optionTextActive: {
        color: "#000",
        fontWeight: "700",
    },
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    toggleLabel: {
        color: "#1A1A1A",
        fontSize: 15,
    },
    switchTrack: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#E0E0E0",
        padding: 2,
        justifyContent: "center",
    },
    switchTrackOn: {
        backgroundColor: GOLD,
    },
    switchThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        elevation: 1,
    },
    switchThumbOn: {
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-end",
    },
});

const colorStyles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: GOLD,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 24,
    },
    colorRow: {
        marginBottom: 20,
    },
    colorInfo: {
        flex: 1,
    },
    label: {
        fontSize: 13,
        color: "#666",
        fontWeight: "600",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: "#F9F9F9",
        marginRight: 16,
    },
    textInput: {
        color: "#1A1A1A",
        fontSize: 15,
        paddingVertical: 10,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        ...Platform.select({
            web: { outlineStyle: 'none' } as any
        })
    },
    colorPreview: {
        width: 52,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    presetsSection: {
        marginTop: 12,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    presetsTitle: {
        fontSize: 22,
        color: "#1E293B",
        fontWeight: "700",
    },
    presetsSubtitle: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 20,
    },
    presetsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 24,
    },
    presetCard: {
        width: "48%",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: 1.6,
    },
    presetCardName: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    colorDotsRow: {
        flexDirection: "row",
        gap: 6,
    },
    colorDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
    },
    randomButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: GOLD_SOFT,
        borderWidth: 1,
        borderColor: GOLD,
        alignSelf: "flex-start",
    },
    randomText: {
        color: GOLD,
        fontSize: 13,
        fontWeight: "600",
    },
});

const styleCardStyles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: GOLD,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: "#666",
        marginBottom: 18,
    },
    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#1A1A1A",
        marginBottom: 8,
    },
    radioOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
    },
});
