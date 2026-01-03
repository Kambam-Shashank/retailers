import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { formatPricePerGram, formatTime } from "@/utils/formatters";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RateDisplayContentProps {
    config: RateConfig;
    calculatedRates: any;
    currentTime: Date;
    viewOnly?: boolean;
    withGST: boolean;
    onToggleGST: () => void;
    onShare: () => void;
    onSetupPress?: () => void;
    gold999Change: ReturnType<typeof usePriceChange>;
    gold916Change: ReturnType<typeof usePriceChange>;
    silver999Change: ReturnType<typeof usePriceChange>;
    silver925Change: ReturnType<typeof usePriceChange>;
}

export const RateDisplayContent: React.FC<RateDisplayContentProps> = ({
    config,
    calculatedRates,
    currentTime,
    viewOnly = false,
    withGST,
    onToggleGST,
    onShare,
    onSetupPress,
    gold999Change,
    gold916Change,
    silver999Change,
    silver925Change,
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const renderPriceChange = (changeInfo: ReturnType<typeof usePriceChange>) => {
        if (!changeInfo.hasChanged) return null;

        const changeColor = changeInfo.isIncrease ? "#00E676" : "#FF5252";
        const arrow = changeInfo.isIncrease ? "↑" : "↓";
        const changeAmount = Math.abs(changeInfo.change / 10).toFixed(
            config.priceDecimalPlaces ?? 0
        );

        return (
            <View style={styles.priceChangeContainer}>
                <Text style={[styles.priceChangeArrow, { color: changeColor }]}>
                    {arrow}
                </Text>
                <Text style={[styles.priceChangeText, { color: changeColor }]}>
                    ₹{changeAmount}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                {/* MOBILE HEADER LAYOUT (Column) */}
                {!isDesktop && (
                    <View style={styles.mobileHeaderContainer}>
                        {/* Row 1: Time (if enabled) */}
                        {config.showTime && (
                            <Text style={[styles.mobileTime, { color: config.textColor || "#FFFFFF" }]}>
                                {formatTime(currentTime)}
                            </Text>
                        )}

                        {/* Row 2: Brand Name & Logo - Centered */}
                        <View style={styles.mobileBrandRow}>
                            {config.logoBase64 && config.logoPlacement === "header" && (
                                <Image
                                    source={{ uri: config.logoBase64 }}
                                    style={[
                                        styles.mobileLogo,
                                        {
                                            width: Math.min(config.logoSize * 0.5, 32),
                                            height: Math.min(config.logoSize * 0.5, 32)
                                        }
                                    ]}
                                    resizeMode="contain"
                                />
                            )}
                            {config.showShopName && (
                                <Text
                                    style={[
                                        styles.mobileShopName,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && { fontFamily: "monospace" },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {config.shopName || "Karatpay"}
                                </Text>
                            )}
                        </View>

                        {/* Row 3: Controls - Stacked Vertically */}
                        <View style={styles.mobileControlsColumn}>
                            {/* Top row: GST + Settings */}
                            <View style={styles.mobileControlsRow}>
                                <View style={styles.mobileGSTToggle}>
                                    <Text style={[styles.gstText, { color: config.textColor || "#FFFFFF", fontSize: 11 }]}>
                                        {withGST ? "GST" : "No GST"}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.mobileToggle, withGST && styles.toggleActive]}
                                        onPress={onToggleGST}
                                    >
                                        <View
                                            style={[
                                                styles.mobileToggleCircle,
                                                withGST && { transform: [{ translateX: 12 }] },
                                            ]}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {!viewOnly && onSetupPress && (
                                    <TouchableOpacity onPress={onSetupPress} style={styles.mobileSetupButton}>
                                        <Text style={styles.mobileSetupIcon}>⚙️</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Bottom: Share */}
                            {!viewOnly && (
                                <TouchableOpacity onPress={onShare} style={styles.mobileShareButton}>
                                    <Text style={styles.mobileShareText}>Share</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* DESKTOP HEADER LAYOUT (Row) */}
                {isDesktop && (
                    <>
                        <View style={[styles.leftSection, { alignItems: "flex-start" }]}>
                            {config.brandAlignment === "left" && (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {config.logoBase64 && config.logoPlacement === "header" && (
                                        <Image
                                            source={{ uri: config.logoBase64 }}
                                            style={[
                                                styles.shopLogo,
                                                { width: config.logoSize, height: config.logoSize },
                                            ]}
                                            resizeMode="contain"
                                        />
                                    )}
                                    {config.showShopName && (
                                        <Text
                                            style={[
                                                styles.shopName,
                                                { color: config.textColor || "#FFFFFF" },
                                                config.fontTheme === "serif" && { fontFamily: "serif" },
                                                config.fontTheme === "classic" && {
                                                    fontFamily: "monospace",
                                                },
                                            ]}
                                        >
                                            {config.shopName || "Karatpay"}
                                        </Text>
                                    )}
                                </View>
                            )}
                            {config.brandAlignment === "center" && config.showTime && (
                                <Text
                                    style={[
                                        styles.time,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatTime(currentTime)}
                                </Text>
                            )}
                            {config.brandAlignment === "right" && config.showTime && (
                                <Text
                                    style={[
                                        styles.time,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatTime(currentTime)}
                                </Text>
                            )}
                        </View>
                        <View
                            style={[
                                styles.centerSection,
                                { flexDirection: isDesktop ? "row" : "column", gap: 10 },
                            ]}
                        >
                            {config.brandAlignment === "center" && (
                                <>
                                    {config.logoBase64 && config.logoPlacement === "header" && (
                                        <Image
                                            source={{ uri: config.logoBase64 }}
                                            style={[
                                                styles.shopLogo,
                                                { width: config.logoSize, height: config.logoSize },
                                                !isDesktop && { marginBottom: 10 },
                                            ]}
                                            resizeMode="contain"
                                        />
                                    )}
                                    {config.showShopName && (
                                        <Text
                                            style={[
                                                styles.shopName,
                                                {
                                                    color: config.textColor || "#FFFFFF",
                                                    textAlign: "center",
                                                },
                                                config.fontTheme === "serif" && { fontFamily: "serif" },
                                                config.fontTheme === "classic" && {
                                                    fontFamily: "monospace",
                                                },
                                                !isDesktop && { fontSize: 26 },
                                            ]}
                                        >
                                            {config.shopName || "Karatpay"}
                                        </Text>
                                    )}
                                </>
                            )}
                            {config.brandAlignment === "left" && config.showTime && (
                                <Text
                                    style={[
                                        styles.time,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatTime(currentTime)}
                                </Text>
                            )}
                        </View>
                        <View style={styles.rightSection}>
                            {config.brandAlignment === "right" ? (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {config.showShopName && (
                                        <Text
                                            style={[
                                                styles.shopName,
                                                {
                                                    color: config.textColor || "#FFFFFF",
                                                    marginRight: 12,
                                                },
                                                config.fontTheme === "serif" && { fontFamily: "serif" },
                                                config.fontTheme === "classic" && {
                                                    fontFamily: "monospace",
                                                },
                                            ]}
                                        >
                                            {config.shopName || "Karatpay"}
                                        </Text>
                                    )}
                                    {config.logoBase64 && config.logoPlacement === "header" && (
                                        <Image
                                            source={{ uri: config.logoBase64 }}
                                            style={[
                                                styles.shopLogo,
                                                { width: config.logoSize, height: config.logoSize },
                                            ]}
                                        />
                                    )}
                                </View>
                            ) : (
                                <View style={styles.headerIcons}>
                                    {!viewOnly && onSetupPress && (
                                        <TouchableOpacity
                                            onPress={onSetupPress}
                                            style={[styles.backButton, { marginRight: 5 }]}
                                        >
                                            <Text style={styles.backArrow}>⚙️</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={onShare}
                                        style={styles.shareButton}
                                    >
                                        <Text style={styles.shareButtonText}>Share</Text>
                                    </TouchableOpacity>

                                    <View style={styles.gstToggle}>
                                        <Text
                                            style={[
                                                styles.gstText,
                                                { color: config.textColor || "#FFFFFF" },
                                            ]}
                                        >
                                            {withGST ? "GST On" : "GST Off"}
                                        </Text>
                                        <TouchableOpacity
                                            style={[styles.toggle, withGST && styles.toggleActive]}
                                            onPress={onToggleGST}
                                        >
                                            <View
                                                style={[
                                                    styles.toggleCircle,
                                                    withGST && styles.toggleCircleActive,
                                                ]}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </View>

            {config.brandAlignment === "right" && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        paddingHorizontal: 20,
                        marginBottom: 10,
                        gap: 15,
                    }}
                >
                    <TouchableOpacity onPress={onShare} style={styles.shareButton}>
                        <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                    <View style={styles.gstToggle}>
                        <Text
                            style={[styles.gstText, { color: config.textColor || "#FFFFFF" }]}
                        >
                            {withGST ? "GST On" : "GST Off"}
                        </Text>
                        <TouchableOpacity
                            style={[styles.toggle, withGST && styles.toggleActive]}
                            onPress={onToggleGST}
                        >
                            <View
                                style={[
                                    styles.toggleCircle,
                                    withGST && styles.toggleCircleActive,
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={[{ paddingHorizontal: 15, paddingBottom: 30 }]}>
                <View
                    style={[
                        styles.consolidatedCard,
                        config.theme === "glass" && styles.glassCard,
                        config.theme === "classic" && styles.classicCard,
                        config.theme === "modern" && styles.modernCard,
                        config.theme === "modern" && styles.modernCard,
                        config.backgroundColor &&
                        config.backgroundColor !== "#000000" &&
                        config.backgroundColor.toLowerCase() !== "black" && {
                            backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent black overlay
                            borderColor: config.cardBorderColor || "rgba(255,255,255,0.1)",
                        },
                        (!config.backgroundColor ||
                            config.backgroundColor === "#000000") && {
                            borderColor: config.cardBorderColor || "#333",
                        },
                        // Apply Custom Border Props
                        {
                            borderRadius: config.cardBorderRadius ?? 16,
                            borderWidth: config.cardBorderWidth ?? 1,
                            borderColor:
                                config.cardBorderColor ||
                                (config.backgroundColor === "#000000"
                                    ? "#333"
                                    : "rgba(255,255,255,0.1)"),
                        },
                    ]}
                >
                    {config.logoBase64 && config.logoPlacement === "card" && (
                        <View
                            style={{
                                alignItems: "center",
                                marginBottom: 15,
                                opacity: config.logoOpacity,
                            }}
                        >
                            <Image
                                source={{ uri: config.logoBase64 }}
                                style={{
                                    width: config.logoSize * 1.5,
                                    height: config.logoSize * 1.5,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    )}

                    {config.showGold24k && (
                        <View
                            style={[
                                styles.rateRow,
                                config.layoutDensity === "compact" && styles.rateRowCompact,
                                config.layoutDensity === "spacious" && styles.rateRowSpacious,
                            ]}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.metalType,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {config.gold24kLabel}
                                </Text>

                                {config.makingChargesEnabled && (
                                    <Text style={styles.makingChargesBig}>
                                        {config.makingCharges24kTitle}:{" "}
                                        {config.makingCharges24kType === "percentage"
                                            ? `${config.makingCharges24kValue}%`
                                            : `₹${(config.makingCharges24kValue / 10).toFixed(config.priceDecimalPlaces ?? 0)}/g`}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={[
                                        styles.price,
                                        { color: config.priceColor || "#D4AF37" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatPricePerGram(calculatedRates.gold999.finalPrice)}
                                </Text>
                                {renderPriceChange(gold999Change)}
                            </View>
                        </View>
                    )}

                    {config.showGold24k && config.showGold22k && (
                        <View style={styles.divider} />
                    )}

                    {config.showGold22k && (
                        <View
                            style={[
                                styles.rateRow,
                                config.layoutDensity === "compact" && styles.rateRowCompact,
                                config.layoutDensity === "spacious" && styles.rateRowSpacious,
                            ]}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.metalType,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {config.gold22kLabel}
                                </Text>

                                {config.makingChargesEnabled && (
                                    <Text style={styles.makingChargesBig}>
                                        {config.makingCharges22kTitle}:{" "}
                                        {config.makingCharges22kType === "percentage"
                                            ? `${config.makingCharges22kValue}%`
                                            : `₹${(config.makingCharges22kValue / 10).toFixed(config.priceDecimalPlaces ?? 0)}/g`}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={[
                                        styles.price,
                                        { color: config.priceColor || "#D4AF37" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatPricePerGram(calculatedRates.gold916.finalPrice)}
                                </Text>
                                {renderPriceChange(gold916Change)}
                            </View>
                        </View>
                    )}

                    {(config.showGold24k || config.showGold22k) &&
                        (config.showSilver999 || config.showSilver925) && (
                            <View style={styles.divider} />
                        )}

                    {config.showSilver999 && (
                        <View
                            style={[
                                styles.rateRow,
                                config.layoutDensity === "compact" && styles.rateRowCompact,
                                config.layoutDensity === "spacious" && styles.rateRowSpacious,
                            ]}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.metalType,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {config.silver999Label}
                                </Text>
                                {config.makingChargesEnabled && (
                                    <Text style={styles.makingChargesBig}>
                                        {config.makingCharges999Title}:{" "}
                                        {config.makingCharges999Type === "percentage"
                                            ? `${config.makingCharges999Value}%`
                                            : `₹${(config.makingCharges999Value / 10).toFixed(config.priceDecimalPlaces ?? 0)}/g`}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={[
                                        styles.price,
                                        { color: config.priceColor || "#D4AF37" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatPricePerGram(calculatedRates.silver999.finalPrice)}
                                </Text>
                                {renderPriceChange(silver999Change)}
                            </View>
                        </View>
                    )}

                    {config.showSilver999 && config.showSilver925 && (
                        <View style={styles.divider} />
                    )}

                    {config.showSilver925 && (
                        <View
                            style={[
                                styles.rateRow,
                                config.layoutDensity === "compact" && styles.rateRowCompact,
                                config.layoutDensity === "spacious" && styles.rateRowSpacious,
                            ]}
                        >
                            <View>
                                <Text
                                    style={[
                                        styles.metalType,
                                        { color: config.textColor || "#FFFFFF" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {config.silver925Label}
                                </Text>
                                {config.makingChargesEnabled && (
                                    <Text style={styles.makingChargesBig}>
                                        {config.makingCharges925Title}:{" "}
                                        {config.makingCharges925Type === "percentage"
                                            ? `${config.makingCharges925Value}%`
                                            : `₹${(config.makingCharges925Value / 10).toFixed(config.priceDecimalPlaces ?? 0)}/g`}
                                    </Text>
                                )}
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={[
                                        styles.price,
                                        { color: config.priceColor || "#D4AF37" },
                                        config.fontTheme === "serif" && { fontFamily: "serif" },
                                        config.fontTheme === "classic" && {
                                            fontFamily: "monospace",
                                        },
                                    ]}
                                >
                                    {formatPricePerGram(calculatedRates.silver925.finalPrice)}
                                </Text>
                                {renderPriceChange(silver925Change)}
                            </View>
                        </View>
                    )}
                </View>

                {/* SHOP DETAILS FOOTER */}
                {(config.shopAddress || config.shopPhone || config.shopEmail) && (
                    <View style={styles.shopDetailsFooter}>
                        <View style={styles.footerBranding}>
                            {config.logoBase64 && (
                                <Image
                                    source={{ uri: config.logoBase64 }}
                                    style={styles.footerLogo}
                                    resizeMode="contain"
                                />
                            )}
                            <Text style={styles.footerShopName}>
                                {config.shopName || "Karatpay"}
                            </Text>
                        </View>

                        <View style={styles.footerColumns}>
                            {config.shopAddress && (
                                <View style={styles.footerColumn}>
                                    <Text style={styles.footerLabel}>Address</Text>
                                    <Text style={styles.footerValue}>{config.shopAddress}</Text>
                                </View>
                            )}

                            {config.shopPhone && (
                                <View style={styles.footerColumn}>
                                    <Text style={styles.footerLabel}>Phone</Text>
                                    {config.shopPhone.split(",").map((p, i) => (
                                        <View key={i} style={styles.footerValueRow}>
                                            <Text style={styles.footerBullet}>›</Text>
                                            <Text style={styles.footerValue}>{p.trim()}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {config.shopEmail && (
                                <View style={styles.footerColumn}>
                                    <Text style={styles.footerLabel}>Email</Text>
                                    <View style={styles.footerValueRow}>
                                        <Text style={styles.footerBullet}>›</Text>
                                        <Text style={styles.footerValue}>{config.shopEmail}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Notifications Footer */}
            {config.notifications && config.notifications.some((n) => n.enabled) && (
                <View style={styles.notificationFooter}>
                    <Text style={styles.notificationText} numberOfLines={1}>
                        {config.notifications
                            .filter((n) => n.enabled)
                            .map((n) => n.message)
                            .join("  •  ")}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingBottom: 16,
        backgroundColor: "transparent",
        flexWrap: "wrap",
    },
    headerDesktop: {
        paddingHorizontal: 40,
    },
    // Mobile-specific header styles
    mobileHeaderContainer: {
        width: "100%",
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
        gap: 8,
    },
    mobileTimeRow: {
        width: "100%",
        alignItems: "flex-start",
    },
    mobileTime: {
        fontSize: 11,
        fontWeight: "500",
        flexShrink: 0,
    },
    mobileBrandRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    mobileLogo: {
        borderRadius: 6,
    },
    mobileShopName: {
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 0.3,
        flexShrink: 1,
    },
    mobileControlsColumn: {
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    mobileControlsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    mobileShareButton: {
        backgroundColor: "#ffffff20",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ffffff40",
    },
    mobileShareText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "600",
    },
    mobileGSTToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    mobileToggle: {
        width: 32,
        height: 18,
        backgroundColor: "#ccc",
        borderRadius: 9,
        justifyContent: "center",
        paddingHorizontal: 2,
    },
    mobileToggleCircle: {
        width: 14,
        height: 14,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    mobileSetupButton: {
        padding: 6,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    mobileSetupIcon: {
        fontSize: 18,
    },
    leftSection: {
        flex: 1,
        alignItems: "flex-start",
    },
    centerSection: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    rightSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 15,
    },
    shopLogo: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    shopName: {
        fontSize: 28,
        fontWeight: "bold",
    },
    time: {
        fontSize: 18,
        fontWeight: "600",
    },
    shareButton: {
        backgroundColor: "#ffffff20",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ffffff40",
    },
    shareButtonText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    headerIcons: {
        flexDirection: "row",
        gap: 15,
    },
    gstToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    metalType: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    price: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 5,
    },
    gstText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#FFFFFF",
    },
    toggle: {
        width: 44,
        height: 26,
        backgroundColor: "#ccc",
        borderRadius: 13,
        justifyContent: "center",
        paddingHorizontal: 2,
    },
    toggleActive: {
        backgroundColor: "#4CAF50",
    },
    toggleCircle: {
        width: 22,
        height: 22,
        backgroundColor: "#fff",
        borderRadius: 11,
    },
    toggleCircleActive: {
        transform: [{ translateX: 18 }],
    },
    makingChargesBig: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#D4AF37", // Gold color for importance
        marginTop: 5,
    },
    consolidatedCard: {
        margin: 15,
        borderRadius: 16,
        padding: 20,
        backgroundColor: "#1A1A1A",
        borderWidth: 1,
        borderColor: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glassCard: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    classicCard: {
        backgroundColor: "#FFF",
        borderColor: "#CCC",
        shadowColor: "#000",
        shadowOpacity: 0.1,
    },
    modernCard: {
        backgroundColor: "#111",
        borderColor: "#D4AF37",
    },
    rateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    rateRowCompact: {
        paddingVertical: 8,
    },
    rateRowSpacious: {
        paddingVertical: 20,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        marginVertical: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    backArrow: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    notificationFooter: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginTop: 20,
        alignItems: "center",
    },
    notificationText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    shopDetailsFooter: {
        marginTop: 40,
        padding: 30,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.05)",
    },
    footerBranding: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },
    footerLogo: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    footerShopName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    footerColumns: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 30,
    },
    footerColumn: {
        flex: 1,
        minWidth: 200,
    },
    footerLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 12,
    },
    footerValue: {
        fontSize: 14,
        color: "#D1D1D1",
    },
    footerValueRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    footerBullet: {
        fontSize: 16,
        color: "#D4AF37",
        marginRight: 8,
    },
    priceChangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    priceChangeArrow: {
        fontSize: 24,
        fontWeight: "bold",
        marginRight: 6,
    },
    priceChangeText: {
        fontSize: 16,
        fontWeight: "700",
    },
});
