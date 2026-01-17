import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { formatPricePerGram } from "@/utils/formatters";
import { Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from "react";
import {
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from 'react-native-shadow-2';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

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
    <View
        style={styles.animatedCardContainer}
    >
        <Shadow
            distance={8}
            startColor={'rgba(0, 0, 0, 0.08)'}
            offset={[0, 4]}
            style={{
                width: '100%',
                borderRadius: config.cardBorderRadius || 24,
            }}
            containerStyle={{ width: '100%' }}
        >
            <View
                style={[
                    styles.card,
                    {
                        borderRadius: config.cardBorderRadius || 24,
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        overflow: 'hidden',
                        ...Platform.select({
                            web: { backdropFilter: 'blur(10px)' } as any
                        })
                    }
                ]}
            >
                {Platform.OS !== 'web' && (
                    <BlurView
                        intensity={20}
                        tint="light"
                        style={StyleSheet.absoluteFill}
                    />
                )}
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: config.cardBackgroundColor || 'rgba(255, 255, 255, 0.4)',
                        }
                    ]}
                />
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
        </Shadow>
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
        <View
            style={styles.container}
        >
            <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width="100%">
                    <Defs>
                        <RadialGradient
                            id="backgroundGlow"
                            cx="50%"
                            cy="50%"
                            rx="100%"
                            ry="100%"
                        >
                            <Stop offset="0" stopColor="black" stopOpacity="0.25" />
                            <Stop offset="1" stopColor="white" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={config.backgroundColor || '#FFFDF5'}
                    />
                    <Rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#backgroundGlow)"
                    />
                </Svg>
            </View>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={[styles.header, { justifyContent: config.brandAlignment === 'center' ? 'center' : 'flex-start' }]}>
                    {config.brandAlignment === 'right' ? (
                        <>
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
                        {(config.purityOrder || ["gold24k", "gold22k", "gold20k", "gold18k", "gold14k", "silver999", "silver925"]).map((key, index) => {
                            const rateCardData: Record<string, {
                                show: boolean;
                                label: string;
                                subtext: string;
                                price: number;
                                color: string;
                                isGold?: boolean;
                            }> = {
                                gold24k: {
                                    show: config.showGold24k,
                                    label: config.gold24kLabel || "24K Gold",
                                    subtext: "per g • 999",
                                    price: calculatedRates.gold999.finalPrice,
                                    color: config.priceColor || goldColor,
                                    isGold: true
                                },
                                gold22k: {
                                    show: config.showGold22k,
                                    label: config.gold22kLabel || "22K Gold",
                                    subtext: "per g • 916",
                                    price: calculatedRates.gold916.finalPrice,
                                    color: config.priceColor || goldColor,
                                    isGold: true
                                },
                                gold20k: {
                                    show: config.showGold20k,
                                    label: config.gold20kLabel || "20K Gold",
                                    subtext: "per g • 833",
                                    price: calculatedRates.gold20k.finalPrice,
                                    color: config.priceColor || goldColor,
                                    isGold: true
                                },
                                gold18k: {
                                    show: config.showGold18k,
                                    label: config.gold18kLabel || "18K Gold",
                                    subtext: "per g • 750",
                                    price: calculatedRates.gold18k.finalPrice,
                                    color: config.priceColor || goldColor,
                                    isGold: true
                                },
                                gold14k: {
                                    show: config.showGold14k,
                                    label: config.gold14kLabel || "14K Gold",
                                    subtext: "per g • 583",
                                    price: calculatedRates.gold14k.finalPrice,
                                    color: config.priceColor || goldColor,
                                    isGold: true
                                },
                                silver999: {
                                    show: config.showSilver999,
                                    label: config.silver999Label || "Pure Silver",
                                    subtext: "per g • 999",
                                    price: calculatedRates.silver999.finalPrice,
                                    color: config.priceColor || silverColor
                                },
                                silver925: {
                                    show: config.showSilver925,
                                    label: config.silver925Label || "925 Silver",
                                    subtext: "per g • Sterling",
                                    price: calculatedRates.silver925.finalPrice,
                                    color: config.priceColor || silverColor
                                }
                            };

                            const cardInfo = rateCardData[key];
                            if (!cardInfo || !cardInfo.show) return null;

                            return (
                                <Animated.View
                                    key={key}
                                    entering={FadeInUp.delay((index + 1) * 100).duration(600)}
                                    style={styles.gridItem}
                                >
                                    <RateCard
                                        label={cardInfo.label}
                                        subtext={cardInfo.subtext}
                                        price={formatPricePerGram(cardInfo.price)}
                                        priceColor={cardInfo.color}
                                        isGold={cardInfo.isGold}
                                        config={config}
                                    />
                                </Animated.View>
                            );
                        })}
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
                                            <Feather name="map-pin" size={18} color={config.textColor || '#2D3748'} />
                                            <Text style={[styles.contactValueCenter, { color: config.textColor || '#2D3748' }]}>{config.shopAddress}</Text>
                                        </View>
                                    )}
                                    {config.shopPhone && (
                                        <View style={styles.contactRowCenter}>
                                            <TouchableOpacity
                                                style={styles.contactRowCenter}
                                                onPress={() => {
                                                    const cleanNumber = config.shopPhone.replace(/[^0-9]/g, '');
                                                    Linking.openURL(`tel:${cleanNumber}`);
                                                }}
                                            >
                                                <Feather name="phone" size={18} color={config.textColor || '#2D3748'} />
                                                <Text style={[styles.contactValueCenter, { color: config.textColor || '#2D3748' }]}>{config.shopPhone}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.whatsappBadge}
                                                onPress={() => {
                                                    const cleanNumber = config.shopPhone.replace(/[^0-9]/g, '');
                                                    // Ensure it has a country code prefix for WhatsApp if not present
                                                    const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
                                                    Linking.openURL(`https://wa.me/${finalNumber}`);
                                                }}
                                            >
                                                <FontAwesome name="whatsapp" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.poweredByContainer}>
                                <Text style={styles.poweredByLabel}>Powered by</Text>
                                <View style={styles.karatpayBadge}>
                                    <View style={styles.karatpayIconBox}>
                                        <MaterialCommunityIcons name="star-four-points" size={12} color="#FFF" />
                                    </View>
                                    <Text style={styles.karatpayText}>Karatpay</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        // overflow: 'hidden',
    },
    backgroundDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    glowBlob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.5,
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
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
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
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    animatedCardContainer: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    card: {
        height: 100,
        position: 'relative',
        // overflow: 'hidden',
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
        flexDirection: 'row',
        alignItems: 'center',
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
        textShadowColor: 'rgba(0, 0, 0, 0.05)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardSubtext: {
        fontSize: 10,
        color: '#666666',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    cardPrice: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
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
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        width: '100%',
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    contactRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactValueCenter: {
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.8,
    },
    whatsappBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    poweredByContainer: {
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    poweredByLabel: {
        fontSize: 12,
        color: '#A0AEC0',
        fontWeight: '500',
    },
    karatpayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    karatpayIconBox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#1B3030',
        justifyContent: 'center',
        alignItems: 'center',
    },
    karatpayText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1B3030',
        letterSpacing: 0.5,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 24,
    },
});

