import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { formatPricePerGram } from "@/utils/formatters";
import { Feather } from '@expo/vector-icons';
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
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

const RateCard = ({
    label,
    price,
    subtext,
    priceColor,
    isGold,
    config
}: {
    label: string;
    price: string;
    subtext: string;
    priceColor: string;
    isGold?: boolean;
    config: RateConfig;
}) => (
    <View style={[
        styles.card,
        {
            backgroundColor: config.cardBackgroundColor || '#FFFFFF',
            borderRadius: config.cardBorderRadius || 24,
        }
    ]}>
        <View style={styles.cardContent}>
            <View>
                <Text style={[styles.cardLabel, { color: config.textColor || '#5D4037' }]}>{label}</Text>
                <Text style={styles.cardSubtext}>{subtext}</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={[styles.cardPrice, { color: priceColor }]}>{price}</Text>
            </View>
        </View>
    </View>
);

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

    const goldColor = "#E6A119";
    const silverColor = "#4A5568";

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: config.backgroundColor || "#FFFDF5" }]} edges={['top']}>
            <View style={[styles.header, { justifyContent: config.brandAlignment === 'center' ? 'center' : 'flex-start' }]}>
                {config.brandAlignment === 'right' ? (
                    <>
                        {/* Action Buttons on the Left */}
                        <View style={[styles.actionColumn, { alignItems: 'flex-start' }]}>
                            <View style={styles.headerRight}>
                                <TouchableOpacity onPress={onShare} style={styles.iconButton}>
                                    <Feather name="share-2" size={20} color="#5D4037" />
                                </TouchableOpacity>
                                {!viewOnly && onSetupPress && (
                                    <TouchableOpacity onPress={onSetupPress} style={styles.iconButton}>
                                        <Feather name="settings" size={20} color="#5D4037" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={[styles.gstToggleRow, { alignSelf: 'flex-start' }]}>
                                <TouchableOpacity
                                    onPress={onToggleGST}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.switchTrack,
                                        {
                                            backgroundColor: withGST ? (config.priceColor || '#E6A119') : '#EEEEEE',
                                            borderColor: withGST ? (config.priceColor || '#E6A119') : '#E0E0E0'
                                        }
                                    ]}
                                >
                                    <View style={[styles.switchThumb, withGST && styles.switchThumbOn]} />
                                </TouchableOpacity>
                                <View
                                    style={[
                                        styles.gstToggle,
                                        {
                                            backgroundColor: withGST ? (config.priceColor || '#E6A119') : (config.cardBackgroundColor || '#FFFFFF'),
                                            borderColor: withGST ? (config.priceColor || '#E6A119') : '#E0E0E0'
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.gstToggleText,
                                        { color: withGST ? '#FFFFFF' : (config.textColor || '#5D4037') }
                                    ]}>
                                        {withGST ? "With GST" : "Without GST"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flex: 1 }} />

                        {/* Branding on the Right */}
                        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                            {config.logoBase64 && (
                                <Image
                                    source={{ uri: config.logoBase64 }}
                                    style={{
                                        width: Math.min(config.logoSize * 1.5, width * 0.4),
                                        height: Math.min(config.logoSize, 80),
                                        opacity: config.logoOpacity || 1
                                    }}
                                    resizeMode="contain"
                                />
                            )}
                            <Text
                                style={[
                                    styles.brandName,
                                    {
                                        color: config.textColor || '#5D4037',
                                        fontSize: Math.min(isDesktop ? 28 : 20, width * 0.1)
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {config.shopName || "karatpay"}
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Branding on the Left (or Center) */}
                        <View style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: config.brandAlignment === 'center' ? 'center' : 'flex-start',
                                gap: 4
                            }
                        ]}>
                            {config.logoBase64 && (
                                <Image
                                    source={{ uri: config.logoBase64 }}
                                    style={{
                                        width: Math.min(config.logoSize * 1.5, width * 0.4),
                                        height: Math.min(config.logoSize, 80),
                                        opacity: config.logoOpacity || 1
                                    }}
                                    resizeMode="contain"
                                />
                            )}
                            <Text
                                style={[
                                    styles.brandName,
                                    {
                                        color: config.textColor || '#5D4037',
                                        fontSize: Math.min(isDesktop ? 28 : 20, width * 0.1)
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {config.shopName || "karatpay"}
                            </Text>
                        </View>

                        {config.brandAlignment !== 'center' && <View style={{ flex: 1 }} />}

                        {/* Action Buttons on the Right */}
                        <View style={[styles.actionColumn, { alignItems: 'flex-end' }]}>
                            <View style={styles.headerRight}>
                                <TouchableOpacity onPress={onShare} style={styles.iconButton}>
                                    <Feather name="share-2" size={20} color="#5D4037" />
                                </TouchableOpacity>
                                {!viewOnly && onSetupPress && (
                                    <TouchableOpacity onPress={onSetupPress} style={styles.iconButton}>
                                        <Feather name="settings" size={20} color="#5D4037" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={[styles.gstToggleRow, { alignSelf: 'flex-end' }]}>
                                <TouchableOpacity
                                    onPress={onToggleGST}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.switchTrack,
                                        {
                                            backgroundColor: withGST ? (config.priceColor || '#E6A119') : '#EEEEEE',
                                            borderColor: withGST ? (config.priceColor || '#E6A119') : '#E0E0E0'
                                        }
                                    ]}
                                >
                                    <View style={[styles.switchThumb, withGST && styles.switchThumbOn]} />
                                </TouchableOpacity>
                                <View
                                    style={[
                                        styles.gstToggle,
                                        {
                                            backgroundColor: withGST ? (config.priceColor || '#E6A119') : (config.cardBackgroundColor || '#FFFFFF'),
                                            borderColor: withGST ? (config.priceColor || '#E6A119') : '#E0E0E0'
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.gstToggleText,
                                        { color: withGST ? '#FFFFFF' : (config.textColor || '#5D4037') }
                                    ]}>
                                        {withGST ? "With GST" : "Without GST"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {config.showGold24k && (
                        <View style={styles.gridItem}>
                            <RateCard
                                label={config.gold24kLabel || "24K Gold"}
                                subtext="per g • 999"
                                price={formatPricePerGram(calculatedRates.gold999.finalPrice)}
                                priceColor={goldColor}
                                isGold
                                config={config}
                            />
                        </View>
                    )}
                    {config.showGold22k && (
                        <View style={styles.gridItem}>
                            <RateCard
                                label={config.gold22kLabel || "22K Gold"}
                                subtext="per g • 916"
                                price={formatPricePerGram(calculatedRates.gold916.finalPrice)}
                                priceColor={goldColor}
                                isGold
                                config={config}
                            />
                        </View>
                    )}
                    {config.showSilver999 && (
                        <View style={styles.gridItem}>
                            <RateCard
                                label={config.silver999Label || "Pure Silver"}
                                subtext="per g • 999"
                                price={formatPricePerGram(calculatedRates.silver999.finalPrice)}
                                priceColor={silverColor}
                                config={config}
                            />
                        </View>
                    )}
                    {config.showSilver925 && (
                        <View style={styles.gridItem}>
                            <RateCard
                                label={config.silver925Label || "925 Silver"}
                                subtext="per g • Sterling"
                                price={formatPricePerGram(calculatedRates.silver925.finalPrice)}
                                priceColor={silverColor}
                                config={config}
                            />
                        </View>
                    )}
                </View>

                {(config.notifications?.some((n) => n.enabled) || config.shopAddress || config.shopPhone || config.shopEmail) && (
                    <View style={styles.notificationFooter}>
                        {config.notifications?.filter((n) => n.enabled).map((n, index) => (
                            <View key={index} style={[styles.notificationPill, { backgroundColor: 'rgba(255,255,255,0.5)', borderColor: 'rgba(0,0,0,0.05)' }]}>
                                <Text style={[styles.notificationText, { color: config.textColor || '#5D4037' }]}>
                                    {n.message}
                                </Text>
                            </View>
                        ))}

                        {(config.notifications?.some((n) => n.enabled)) && (config.shopAddress || config.shopPhone || config.shopEmail) && (
                            <View style={styles.separator} />
                        )}

                        {(config.shopAddress || config.shopPhone || config.shopEmail) && (
                            <View style={styles.contactCenter}>
                                {config.shopAddress && (
                                    <View style={styles.contactRowCenter}>
                                        <Feather name="map-pin" size={14} color={config.textColor || '#5D4037'} />
                                        <Text style={[styles.contactValueCenter, { color: config.textColor || '#5D4037' }]}>{config.shopAddress}</Text>
                                    </View>
                                )}
                                {config.shopPhone && (
                                    <View style={styles.contactRowCenter}>
                                        <Feather name="phone" size={14} color={config.textColor || '#5D4037'} />
                                        <Text style={[styles.contactValueCenter, { color: config.textColor || '#5D4037' }]}>{config.shopPhone}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={styles.poweredBy}>
                            <Text style={[styles.poweredByText, { color: config.textColor || '#9E9E9E' }]}>
                                Powered by <Text style={{ fontWeight: '800' }}>Karatpay</Text>
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        width: '100%',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    actionColumn: {
        flexDirection: 'column',
        gap: 8,
    },
    gstToggle: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    gstToggleText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#5D4037',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    gstToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchTrack: {
        width: 32,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#EEEEEE',
        padding: 2,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    switchThumb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    switchThumbOn: {
        alignSelf: 'flex-end',
    },
    brandName: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    card: {
        height: 140,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },
    cardGlow: {
        position: 'absolute',
        right: -30,
        top: -20,
        bottom: -20,
        width: '60%',
        borderRadius: 100,
        opacity: 0.6,
    },
    cardContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        zIndex: 1,
    },
    priceContainer: {
        alignItems: 'flex-start',
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    cardSubtext: {
        fontSize: 10,
        color: '#9E9E9E',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardPrice: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    notificationFooter: {
        marginTop: 40,
        paddingBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    notificationPill: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    notificationText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    contactCenter: {
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 32,
        width: '100%',
    },
    contactRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    contactValueCenter: {
        fontSize: 15,
        fontWeight: '500',
        opacity: 0.7,
    },
    poweredBy: {
        marginTop: 10,
        opacity: 0.4,
    },
    poweredByText: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 24,
    },
});

