import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { formatPricePerGram, formatTime } from "@/utils/formatters";
import { Marquee } from "@animatereactnative/marquee";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

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
  config,
  isMobile,
  isSmallMobile,
}: {
  label: string;
  price: string;
  subtext: string;
  priceColor: string;
  isGold?: boolean;
  config: RateConfig;
  isMobile: boolean;
  isSmallMobile: boolean;
}) => {
  const gradientColors = isGold
    ? ["#FFD700", "#FF8C00"]
    : ["#E2E8F0", "#CBD5E0"];

  const labelFontSize = isSmallMobile ? 15 : isMobile ? 16 : 18;
  const priceFontSize = isSmallMobile ? 24 : isMobile ? 26 : 28;
  const subtextFontSize = isSmallMobile ? 10 : 11;

  const isMinimal = config.fontTheme === "minimal";
  const labelWeight = isMinimal ? "600" : "800";
  const priceWeight = isMinimal ? "400" : "600";
  const labelLetterSpacing = isMinimal ? 0.5 : 0.2;
  const priceLetterSpacing = isMinimal ? -0.2 : -0.5;
  const subtextWeight = isMinimal ? "600" : "800";

  return (
    <View
      style={[styles.animatedCardContainer, { marginBottom: 4 }]}
    >
      <Shadow
        distance={12}
        startColor={"rgba(0, 0, 0, 0.1)"}
        offset={[0, 6]}
        style={{
          width: "100%",
          borderRadius: config.cardBorderRadius || 24,
        }}
        containerStyle={{ width: "100%" }}
      >
        <View
          style={[
            styles.card,
            {
              borderRadius: config.cardBorderRadius || 24,
              overflow: "hidden",
            },
          ]}
        >
          {Platform.OS !== "web" ? (
            <BlurView
              intensity={30}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  ...Platform.select({
                    web: {
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    } as any,
                  }),
                },
              ]}
            />
          )}
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <LinearGradient
                id="cardGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="0.2" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#cardGradient)"
            />
          </Svg>

          <View
            style={[
              styles.cardGlow,
              {
                backgroundColor: isGold
                  ? "rgba(255, 215, 0, 0.1)"
                  : "rgba(192, 192, 192, 0.1)",
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />

          <View style={[styles.cardContent, { paddingHorizontal: 16, paddingVertical: 22 }]}>
            <View>
              <Text
                style={[
                  styles.cardLabel,
                  {
                    color: config.textColor || (isGold ? "#5D4037" : "#2D3748"),
                    fontSize: labelFontSize,
                    marginBottom: 4,
                    fontWeight: labelWeight,
                    letterSpacing: labelLetterSpacing,
                  },
                ]}
              >
                {label}
              </Text>
              <View
                style={[
                  styles.subtextContainer,
                  {
                    backgroundColor: isGold
                      ? "rgba(230, 161, 25, 0.2)"
                      : "rgba(74, 85, 104, 0.2)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardSubtext,
                    {
                      color: isGold ? "#8B6914" : "#4A5568",
                      fontSize: subtextFontSize,
                      fontWeight: subtextWeight,
                    },
                  ]}
                >
                  {subtext}
                </Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.cardPrice,
                  {
                    color: priceColor,
                    fontSize: priceFontSize,
                    textShadowColor: "rgba(0, 0, 0, 0.1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                    fontWeight: priceWeight,
                    letterSpacing: priceLetterSpacing,
                  },
                ]}
              >
                {price}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );
};

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
  const isMobile = width < 420;
  const isSmallMobile = width < 360;

  const enabledNotifications = (config.notifications || []).filter(
    (n) => n.enabled
  );

  const rateSubtext = withGST ? "per gram (incl. GST)" : "per gram";

  const rateItemsByKey: Record<
    string,
    | {
      key: string;
      visible: boolean;
      label: string;
      price: number;
      isGold: boolean;
    }
    | undefined
  > = {
    gold24k: {
      key: "gold24k",
      visible: Boolean(config.showGold24k),
      label: config.gold24kLabel || "24K Gold",
      price: calculatedRates?.gold999?.finalPrice ?? 0,
      isGold: true,
    },
    gold22k: {
      key: "gold22k",
      visible: Boolean(config.showGold22k),
      label: config.gold22kLabel || "22K Gold",
      price: calculatedRates?.gold916?.finalPrice ?? 0,
      isGold: true,
    },
    gold20k: {
      key: "gold20k",
      visible: Boolean(config.showGold20k),
      label: config.gold20kLabel || "20K Gold",
      price: calculatedRates?.gold20k?.finalPrice ?? 0,
      isGold: true,
    },
    gold18k: {
      key: "gold18k",
      visible: Boolean(config.showGold18k),
      label: config.gold18kLabel || "18K Gold",
      price: calculatedRates?.gold18k?.finalPrice ?? 0,
      isGold: true,
    },
    gold14k: {
      key: "gold14k",
      visible: Boolean(config.showGold14k),
      label: config.gold14kLabel || "14K Gold",
      price: calculatedRates?.gold14k?.finalPrice ?? 0,
      isGold: true,
    },
    silver999: {
      key: "silver999",
      visible: Boolean(config.showSilver999),
      label: config.silver999Label || "Pure Silver",
      price: calculatedRates?.silver999?.finalPrice ?? 0,
      isGold: false,
    },
    silver925: {
      key: "silver925",
      visible: Boolean(config.showSilver925),
      label: config.silver925Label || "925 Silver",
      price: calculatedRates?.silver925?.finalPrice ?? 0,
      isGold: false,
    },
  };

  const orderedRateItems = (
    config.purityOrder?.length
      ? config.purityOrder
      : [
        "gold24k",
        "gold22k",
        "gold20k",
        "gold18k",
        "gold14k",
        "silver999",
        "silver925",
      ]
  )
    .map((k) => rateItemsByKey[k])
    .filter(Boolean)
    .filter((item) => item!.visible) as Array<{
      key: string;
      label: string;
      price: number;
      isGold: boolean;
    }>;

  const headerDirection =
    config.brandAlignment === "right" ? "row-reverse" : "row";
  const contentAlignItems =
    config.brandAlignment === "center"
      ? "center"
      : config.brandAlignment === "right"
        ? "flex-end"
        : "flex-start";
  const textAlign =
    config.brandAlignment === "center"
      ? "center"
      : config.brandAlignment === "right"
        ? "right"
        : "left";

  const SafeContainer = viewOnly ? View : SafeAreaView;

  return (
    <View style={styles.container}>
      <SafeContainer style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { flexDirection: headerDirection }]}>
            <View style={{ flex: 1, alignItems: contentAlignItems }}>
              <View
                style={{
                  flexDirection:
                    config.brandAlignment === "right" ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {config.logoBase64 && (
                  <Image
                    source={{ uri: config.logoBase64 }}
                    style={{
                      width: config.logoSize || 80,
                      height: config.logoSize || 80,
                      opacity: config.logoOpacity ?? 1,
                    }}
                    resizeMode="contain"
                  />
                )}
                <View style={{ alignItems: contentAlignItems }}>
                  {config.showShopName && (
                    <Text
                      style={[
                        styles.brandName,
                        {
                          color: config.textColor || "#2D3748",
                          fontSize: 18,
                          textAlign: textAlign,
                        },
                      ]}
                    >
                      {config.shopName}
                    </Text>
                  )}

                  {(config.showDate || config.showTime) && (
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                        color: config.textColor || "#2D3748",
                        opacity: 0.75,
                        textAlign: textAlign,
                      }}
                    >
                      {(config.showDate
                        ? currentTime.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "") +
                        (config.showDate && config.showTime ? " • " : "") +
                        (config.showTime ? formatTime(currentTime) : "")}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View
                style={[
                  styles.buttonRow,
                  {
                    flexDirection:
                      headerDirection === "row-reverse" ? "row-reverse" : "row",
                  },
                ]}
              >
                {!viewOnly && onSetupPress && (
                  <TouchableOpacity
                    style={[styles.iconButton, { marginRight: 0 }]}
                    onPress={onSetupPress}
                  >
                    <Feather
                      name="settings"
                      size={20}
                      color={config.textColor || "#2D3748"}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.iconButton} onPress={onShare}>
                  <Feather
                    name="share-2"
                    size={20}
                    color={config.textColor || "#2D3748"}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.gstToggle} onPress={onToggleGST}>
                <View style={styles.gstToggleRow}>
                  <Text style={styles.gstToggleText}>GST</Text>
                  <View style={styles.switchTrack}>
                    <View
                      style={[
                        styles.switchThumb,
                        withGST && styles.switchThumbOn,
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.grid, { marginHorizontal: 0 }]}>
            {orderedRateItems.map((item) => (
              <View key={item.key} style={[styles.gridItem, { paddingHorizontal: 0, marginBottom: 12 }]}>
                <RateCard
                  label={item.label}
                  price={formatPricePerGram(item.price)}
                  subtext={rateSubtext}
                  priceColor={
                    config.priceColor || (item.isGold ? "#E6A119" : "#2D3748")
                  }
                  isGold={item.isGold}
                  config={config}
                  isMobile={isMobile}
                  isSmallMobile={isSmallMobile}
                />
              </View>
            ))}
          </View>

          {(config.notifications?.some((n) => n.enabled) ||
            config.shopAddress ||
            config.shopPhone ||
            config.shopEmail) && (
              <View style={styles.notificationFooter}>
                {/* ... */}

                {!!enabledNotifications.length && (
                  <View style={styles.announcementsContainer}>
                    <View style={styles.announcementsHeader}>
                      <MaterialCommunityIcons
                        name="star-four-points"
                        size={18}
                        color={config.textColor || "#2D3748"}
                      />
                      <Text
                        style={[
                          styles.announcementsTitle,
                          { color: config.textColor || "#2D3748" },
                        ]}
                      >
                        ANNOUNCEMENTS
                      </Text>
                    </View>

                    <View style={styles.marqueeViewport}>
                      <Marquee spacing={0} speed={0.3}>
                        <View style={[styles.notificationsRow, { paddingRight: width }]}>
                          {enabledNotifications.map((n, index) => (
                            <View
                              key={`n-marquee-${index}`}
                              style={styles.notificationPill}
                            >
                              <View
                                style={[
                                  styles.notificationDot,
                                  {
                                    backgroundColor:
                                      config.priceColor ||
                                      (isMobile ? "#E6A119" : "#2D3748"),
                                  },
                                ]}
                              />
                              <Text
                                style={[
                                  styles.notificationText,
                                  { color: config.textColor || "#2D3748" },
                                ]}
                              >
                                {n.message}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </Marquee>
                    </View>
                  </View>
                )}

                {config.notifications?.some((n) => n.enabled) &&
                  (config.shopAddress ||
                    config.shopPhone ||
                    config.shopEmail) && <View style={styles.separator} />}

                {(config.shopAddress || config.shopPhone || config.shopEmail) && (
                  <View style={styles.contactCenter}>
                    {config.shopAddress && (
                      <View style={styles.contactRowCenter}>
                        <Feather
                          name="map-pin"
                          size={18}
                          color={config.textColor || "#2D3748"}
                        />
                        <Text
                          style={[
                            styles.contactValueCenter,
                            { color: config.textColor || "#2D3748" },
                          ]}
                        >
                          {config.shopAddress}
                        </Text>
                      </View>
                    )}
                    {config.shopPhone && (
                      <View style={styles.contactRowCenter}>
                        <TouchableOpacity
                          style={styles.contactRowCenter}
                          onPress={() => {
                            const cleanNumber = config.shopPhone.replace(
                              /[^0-9]/g,
                              ""
                            );
                            Linking.openURL(`tel:${cleanNumber}`);
                          }}
                        >
                          <Feather
                            name="phone"
                            size={18}
                            color={config.textColor || "#2D3748"}
                          />
                          <Text
                            style={[
                              styles.contactValueCenter,
                              { color: config.textColor || "#2D3748" },
                            ]}
                          >
                            {config.shopPhone}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.whatsappBadge}
                          onPress={() => {
                            const cleanNumber = config.shopPhone.replace(
                              /[^0-9]/g,
                              ""
                            );
                            const finalNumber =
                              cleanNumber.length === 10
                                ? `91${cleanNumber}`
                                : cleanNumber;
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
                      <MaterialCommunityIcons
                        name="star-four-points"
                        size={12}
                        color="#FFF"
                      />
                    </View>
                    <Text style={styles.karatpayText}>Karatpay</Text>
                  </View>
                </View>
              </View>
            )}
        </ScrollView>
      </SafeContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    // overflow: 'hidden',
  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  glowBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 10,
    width: "100%",
    gap: 16,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 6,
    minWidth: 96,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 0,
    justifyContent: "space-between",
  },
  actionColumn: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  gstToggle: {
    width: "100%",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  gstToggleText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#5D4037",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gstToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchTrack: {
    width: 32,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EEEEEE",
    padding: 2,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  switchThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
  brandName: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginRight: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
  },
  gridItem: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  animatedCardContainer: {
    width: "100%",
    backgroundColor: "transparent",
    transform: [{ translateY: 0 }],
  },
  card: {
    // height: 100, 
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    right: -60,
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtextContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  cardSubtext: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.9,
  },
  cardPrice: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    opacity: 0.95,
  },
  notificationFooter: {
    marginTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  announcementsContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },
  announcementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  announcementsTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  notificationsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  marqueeViewport: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
  },

  notificationPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notificationDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  contactCenter: {
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    width: "100%",
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  contactRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactValueCenter: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.8,
  },
  whatsappBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  poweredByContainer: {
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  poweredByLabel: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  karatpayBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  karatpayIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#1B3030",
    justifyContent: "center",
    alignItems: "center",
  },
  karatpayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B3030",
    letterSpacing: 0.5,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 24,
  },
});
