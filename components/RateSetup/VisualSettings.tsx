import React from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const GOLD = "#D4AF37";
const GOLD_SOFT = "rgba(212, 175, 55, 0.15)";

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
    cardBackgroundColor: string;
    onColorChange: (key: string, value: string) => void;
}

export const ColorCustomizationCard: React.FC<ColorCustomizationCardProps> = ({
    backgroundColor,
    textColor,
    priceColor,
    cardBackgroundColor,
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

            <View style={colorStyles.colorRow}>
                <View style={colorStyles.colorInfo}>
                    <Text style={colorStyles.label}>Card Background</Text>
                    <View style={colorStyles.inputRow}>
                        <View style={colorStyles.inputWrapper}>
                            <TextInput
                                placeholder="#FFFFFF"
                                placeholderTextColor="#A3A3A3"
                                style={[colorStyles.textInput, { outlineStyle: "none" } as any]}
                                value={cardBackgroundColor}
                                onChangeText={(text) => onColorChange("cardBackgroundColor", text)}
                                maxLength={7}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={[colorStyles.colorPreview, { backgroundColor: cardBackgroundColor }]} />
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
                    {THEME_PRESETS.map((p, index) => {
                        const isActive = backgroundColor === p.bg && textColor === p.text && priceColor === p.price;
                        return (
                            <TouchableOpacity
                                key={p.name}
                                style={[
                                    colorStyles.presetCard,
                                    isActive && { borderColor: GOLD, borderWidth: 2 }
                                ]}
                                onPress={() => {
                                    onColorChange("backgroundColor", p.bg);
                                    onColorChange("textColor", p.text);
                                    onColorChange("priceColor", p.price);
                                    onColorChange("cardBackgroundColor", p.cardBg);
                                }}
                            >
                                <View style={StyleSheet.absoluteFill}>
                                    <Svg height="100%" width="100%">
                                        <Defs>
                                            <RadialGradient
                                                id={`grad-${index}`}
                                                cx="50%"
                                                cy="50%"
                                                rx="100%"
                                                ry="100%"
                                            >
                                                <Stop offset="0" stopColor="black" stopOpacity="0.25" />
                                                <Stop offset="1" stopColor="white" stopOpacity="0" />
                                            </RadialGradient>
                                        </Defs>
                                        <Rect x="0" y="0" width="100%" height="100%" fill={p.bg} />
                                        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#grad-${index})`} />
                                    </Svg>
                                </View>
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
        overflow: 'hidden',
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

