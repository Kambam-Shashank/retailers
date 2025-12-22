import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const CARD_DARK = "#121212";
const GOLD_SOFT = "#D4AF3733";
const TEXT_MUTED = "#A1A1A1";

interface ShopBrandingCardProps {
    shopName: string;
    logoBase64: string | null;
    logoSize: number;
    logoPlacement: "header" | "card";
    logoOpacity: number;
    onShopNameChange: (text: string) => void;
    onShopNameBlur: () => void;
    onPickLogo: () => void;
    onDeleteLogo: () => void;
    onUpdate: (updates: Partial<any>) => void;
}

export const ShopBrandingCard: React.FC<ShopBrandingCardProps> = ({
    shopName,
    logoBase64,
    logoSize,
    logoPlacement,
    logoOpacity,
    onShopNameChange,
    onShopNameBlur,
    onPickLogo,
    onDeleteLogo,
    onUpdate,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Shop Branding</Text>
            <Text style={styles.cardSubtitle}>
                Add your shop name and logo to personalize the display
            </Text>

            {/* Shop Name */}
            <View style={styles.section}>
                <Text style={styles.label}>Shop Name</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="Enter your shop name"
                        placeholderTextColor="#A3A3A3"
                        style={[styles.textInput, { outlineStyle: "none" } as any]}
                        value={shopName}
                        onChangeText={onShopNameChange}
                        onBlur={onShopNameBlur}
                        returnKeyType="done"
                        accessibilityLabel="Shop name"
                    />
                </View>
            </View>

            {/* Shop Logo */}
            <View style={[styles.section, { marginBottom: 10 }]}>
                <Text style={styles.label}>Shop Logo</Text>

                <View style={styles.logoRow}>
                    <TouchableOpacity
                        style={[
                            styles.logoPicker,
                            !logoBase64 && styles.logoPickerEmpty,
                        ]}
                        onPress={onPickLogo}
                        activeOpacity={0.8}
                    >
                        {logoBase64 ? (
                            <>
                                <Image
                                    source={{ uri: logoBase64 }}
                                    style={styles.logoImage}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.deleteBadge}
                                    onPress={onDeleteLogo}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.uploadIcon}>⬆️</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.logoTextContainer}>
                        <Text style={styles.helperText}>Max size: 500KB</Text>
                        <Text style={styles.helperText}>Recommended: Square image</Text>
                    </View>
                </View>
            </View>

            {logoBase64 && (
                <View style={{ marginTop: 20 }}>
                    {/* Logo Size */}
                    <View style={styles.controlRow}>
                        <Text style={styles.controlLabel}>Logo Size</Text>
                        <View style={styles.sizeOptions}>
                            {[60, 80, 100, 140].map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => onUpdate({ logoSize: size })}
                                    style={[
                                        styles.sizeBadge,
                                        logoSize === size && styles.activeBadge,
                                    ]}
                                >
                                    <Text style={[styles.badgeText, logoSize === size && styles.activeBadgeText]}>
                                        {size === 60 ? "S" : size === 80 ? "M" : size === 100 ? "L" : "XL"}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Logo Placement */}
                    <View style={styles.controlRow}>
                        <Text style={styles.controlLabel}>Placement</Text>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                onPress={() => onUpdate({ logoPlacement: "header" })}
                                style={[styles.toggleButton, logoPlacement === "header" && styles.activeToggle]}
                            >
                                <Text style={[styles.toggleText, logoPlacement === "header" && styles.activeToggleText]}>
                                    Header
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onUpdate({ logoPlacement: "card" })}
                                style={[styles.toggleButton, logoPlacement === "card" && styles.activeToggle]}
                            >
                                <Text style={[styles.toggleText, logoPlacement === "card" && styles.activeToggleText]}>
                                    Inside Card
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Logo Opacity (Watermark Effect) */}
                    {logoPlacement === "card" && (
                        <View style={styles.controlRow}>
                            <Text style={styles.controlLabel}>Opacity</Text>
                            <View style={styles.sizeOptions}>
                                {[0.1, 0.3, 0.6, 1.0].map((op) => (
                                    <TouchableOpacity
                                        key={op}
                                        onPress={() => onUpdate({ logoOpacity: op })}
                                        style={[
                                            styles.sizeBadge,
                                            logoOpacity === op && styles.activeBadge,
                                        ]}
                                    >
                                        <Text style={[styles.badgeText, logoOpacity === op && styles.activeBadgeText]}>
                                            {op * 100}%
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
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
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        color: TEXT_MUTED,
        fontWeight: "600",
        marginBottom: 10,
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
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoPicker: {
        width: 80,
        height: 80,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "rgba(212, 175, 55, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#161616",
    },
    logoPickerEmpty: {
        backgroundColor: "#161616",
    },
    uploadIcon: {
        fontSize: 28,
        color: GOLD,
    },
    logoImage: {
        width: "100%",
        height: "100%",
    },
    logoTextContainer: {
        marginLeft: 18,
    },
    helperText: {
        fontSize: 13,
        color: TEXT_MUTED,
        marginTop: 4,
    },
    deleteBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#EF4444",
        borderRadius: 999,
        padding: 6,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#0F0F0F",
    },
    deleteIcon: {
        fontSize: 12,
        color: "#fff",
    },
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
    },
    controlLabel: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "500",
    },
    sizeOptions: {
        flexDirection: "row",
        gap: 8,
    },
    sizeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        backgroundColor: "#1A1A1A",
    },
    activeBadge: {
        backgroundColor: GOLD,
        borderColor: GOLD,
    },
    badgeText: {
        color: "#A1A1A1",
        fontSize: 12,
        fontWeight: "600",
    },
    activeBadgeText: {
        color: "#000",
    },
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#1A1A1A",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        overflow: "hidden",
    },
    toggleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    activeToggle: {
        backgroundColor: GOLD,
    },
    toggleText: {
        color: "#A1A1A1",
        fontSize: 12,
        fontWeight: "600",
    },
    activeToggleText: {
        color: "#000",
    },
});
