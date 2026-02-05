import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { formatPricePerGram } from "@/utils/formatters";
import { Marquee } from "@animatereactnative/marquee";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";

interface RateDisplayContentProps {
  config: RateConfig;
  calculatedRates: any;
  currentTime: Date;
  viewOnly?: boolean;
  previewMode?: boolean; // New prop for live preview
  withGST: boolean;
  onToggleGST: () => void;
  onShare: () => void;
  onSetupPress?: () => void;
  shareUrl: string;
  gold999Change: ReturnType<typeof usePriceChange>;
  gold916Change: ReturnType<typeof usePriceChange>;
  silver999Change: ReturnType<typeof usePriceChange>;
  silver925Change: ReturnType<typeof usePriceChange>;
}

const RateCard = ({
  label,
  price,
  priceColor,
  isGold,
  config,
  isMobile,
  isSmallMobile,
  previewMode = false,
}: {
  label: string;
  price: string;
  priceColor: string;
  isGold?: boolean;
  config: RateConfig;
  isMobile: boolean;
  isSmallMobile: boolean;
  previewMode?: boolean;
}) => {
  const gradientColors: [string, string] = isGold
    ? ["#FFD700", "#F59E0B"]
    : ["#E2E8F0", "#94A3B8"];

  const labelFontSize = isSmallMobile ? 15 : isMobile ? 16 : 18;
  const priceFontSize = isSmallMobile ? 24 : isMobile ? 26 : 28;

  const isMinimal = config.fontTheme === "minimal";
  const labelWeight = isMinimal ? "600" : "700";
  const priceWeight = isMinimal ? "400" : "700";

  return (
    <View style={[styles.animatedCardContainer, { marginBottom: 14 }]}>
      <Shadow
        distance={6}
        startColor={"rgba(0, 0, 0, 0.05)"}
        offset={[0, 4]}
        style={{
          width: "100%",
          borderRadius: 16,
        }}
        containerStyle={{ width: "100%" }}
      >
        <View
          style={[
            styles.card,
            {
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
              flexDirection: "row",
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ width: 6, height: "100%" }}
          />

          <View style={styles.cardContent}>
            <View style={{ gap: 2 }}>
              <Text
                style={[
                  styles.cardLabel,
                  {
                    color: "#1E293B", // Dark slate for better readability
                    fontSize: labelFontSize,
                    marginBottom: 0,
                    fontWeight: labelWeight,
                  },
                ]}
              >
                {label}
              </Text>
              {!previewMode && (
                <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }}>
                  per gram
                </Text>
              )}
            </View>
            <View style={styles.priceContainer}>
              <Text
                style={[
                  styles.cardPrice,
                  {
                    color: isGold ? "#D97706" : "#475569",
                    fontSize: priceFontSize,
                    fontWeight: "900", // Increased boldness
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
  previewMode = false,
  withGST,
  onToggleGST,
  onShare,
  onSetupPress,
  shareUrl,
  gold999Change,
  gold916Change,
  silver999Change,
  silver925Change,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 420;
  const isSmallMobile = width < 360;

  const [showQRModal, setShowQRModal] = useState(false);
  const captureRef = useRef<any>(null);

  const handleDownloadQR = async () => {
    try {
      let uri;
      if (Platform.OS === 'web') {
        const html2canvas = require('html2canvas');
        const element = captureRef.current;
        if (!element) return;
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#FFFFFF'
        });
        uri = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = uri;
        link.download = `Karatpay_QR_${(config.shopName || "Rates").replace(/\s+/g, '_')}.png`;
        link.click();
      } else {
        const RNViewShot = require("react-native-view-shot");
        uri = await RNViewShot.captureRef(captureRef, {
          format: 'png',
          quality: 1.0,
          result: 'tmpfile'
        });
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Failed to capture QR:", error);
    }
  };

  const enabledNotifications = (config.notifications || []).filter(
    (n) => n.enabled
  );



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

  let orderedRateItems = (
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

  // In preview mode, limit to 2 gold and 2 silver cards
  if (previewMode) {
    const goldItems = orderedRateItems.filter(item => item.isGold).slice(0, 2);
    const silverItems = orderedRateItems.filter(item => !item.isGold).slice(0, 2);
    orderedRateItems = [...goldItems, ...silverItems];
  }

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

  const SafeContainer = previewMode ? View : SafeAreaView;

  return (
    <LinearGradient
      colors={[config.backgroundColor, config.backgroundColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeContainer style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          {/* Top row with buttons */}
          <View style={styles.topButtonRow}>
            <TouchableOpacity
              style={[styles.iconButton, { marginRight: 8 }]}
              onPress={() => setShowQRModal(true)}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={20}
                color={config.textColor || "#2D3748"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={onShare}>
              <Feather
                name="share-2"
                size={20}
                color={config.textColor || "#2D3748"}
              />
            </TouchableOpacity>

            {!viewOnly && onSetupPress && (
              <TouchableOpacity
                style={[styles.iconButton, { marginLeft: 8 }]}
                onPress={onSetupPress}
              >
                <Feather
                  name="settings"
                  size={20}
                  color={config.textColor || "#2D3748"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Center content with logo and brand name */}
          <View style={styles.centerContent}>
            {config.logoBase64 && (
              <Image
                source={{ uri: config.logoBase64 }}
                style={{
                  width: config.logoSize || 80,
                  height: config.logoSize || 80,
                  opacity: config.logoOpacity ?? 1,
                  marginBottom: 8,
                }}
                resizeMode="contain"
              />
            )}
            {config.showShopName && (
              <Text
                style={[
                  styles.brandName,
                  {
                    color: config.textColor || "#2D3748",
                    fontSize: 26,
                    textAlign: "center",
                    textShadowColor: "rgba(0, 0, 0, 0.1)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  },
                ]}
              >
                {config.shopName}
              </Text>
            )}
          </View>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            orderedRateItems.length <= 3 && {
              flexGrow: 1,
              justifyContent: 'center', // Center content vertically
              paddingTop: 40 // Add space between header and cards
            }
          ]}
        >
          <View style={[styles.grid, { marginHorizontal: 0 }]}>
            {orderedRateItems.map((item) => (
              <View key={item.key} style={[styles.gridItem, { paddingHorizontal: 0, marginBottom: 0 }]}>
                <RateCard
                  label={item.label}
                  price={formatPricePerGram(item.price)}

                  priceColor={
                    config.priceColor || (item.isGold ? "#E6A119" : "#2D3748")
                  }
                  isGold={item.isGold}
                  config={config}
                  isMobile={isMobile}
                  isSmallMobile={isSmallMobile}
                  previewMode={previewMode}
                />
              </View>
            ))}
          </View>

          {/* Show mock announcements in preview mode */}
          {previewMode && (
            <View style={styles.announcementsSection}>
              <View style={styles.announcementsHeader}>
                <MaterialCommunityIcons
                  name="bullhorn-outline"
                  size={16}
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
                    <View style={styles.notificationPill}>
                      <View
                        style={[
                          styles.notificationDot,
                          { backgroundColor: config.priceColor || "#2D3748" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.notificationText,
                          { color: config.textColor || "#2D3748" },
                        ]}
                      >
                        Special discount on gold today!
                      </Text>
                    </View>
                  </View>
                </Marquee>
              </View>
            </View>
          )}

          {(config.notifications?.some((n) => n.enabled) ||
            config.shopAddress ||
            config.shopPhone ||
            config.shopEmail) && (
              <View style={styles.notificationFooter}>
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
                      <TouchableOpacity
                        style={styles.contactRowCenter}
                        onPress={() => {
                          const query = encodeURIComponent(config.shopAddress);
                          Linking.openURL(
                            `https://www.google.com/maps/search/?api=1&query=${query}`
                          );
                        }}
                      >
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
                      </TouchableOpacity>
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

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <TouchableOpacity
          style={styles.qrModalOverlay}
          activeOpacity={1}
          onPress={() => setShowQRModal(false)}
        >
          <View style={styles.qrContainer}>
            <TouchableOpacity
              style={styles.qrCloseIcon}
              onPress={() => setShowQRModal(false)}
            >
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>

            <Text style={styles.qrTitle}>Scan for Live Rates</Text>
            <Text style={styles.qrShopName}>{config.shopName}</Text>

            <View style={styles.qrWrapper}>
              <QRCode
                value={shareUrl || "https://karatpay.in"}
                size={220}
                logo={config.logoBase64 ? { uri: config.logoBase64 } : undefined}
                logoSize={50}
                logoBackgroundColor='#FFFFFF'
                logoMargin={2}
                ecl="H"
              />
            </View>

            <View style={styles.poweredByContainer}>
              <Text style={styles.poweredByLabel}>Powered by</Text>
              <View style={styles.karatpayBadge}>
                <View style={[styles.karatpayIconBox, { backgroundColor: '#F59E0B' }]}>
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={10}
                    color="#FFF"
                  />
                </View>
                <Text style={[styles.karatpayText, { color: '#64748B' }]}>Karatpay</Text>
              </View>
            </View>

            <View style={styles.qrActionRow}>
              <TouchableOpacity
                style={styles.qrButton}
                onPress={handleDownloadQR}
              >
                <Feather name="download" size={18} color="#FFF" />
                <Text style={styles.qrButtonText}>{Platform.OS === 'web' ? 'Download' : 'Share'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hidden capture view for high-res QR sharing */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: -9999,
              top: -9999,
              opacity: 0,
            }}
          >
            <View ref={captureRef} style={{ backgroundColor: '#FFF', padding: 60, alignItems: 'center', width: 800 }}>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#000', marginBottom: 40, textAlign: 'center' }}>
                {config.shopName?.toUpperCase()}
              </Text>

              <QRCode
                value={shareUrl || "https://karatpay.in"}
                size={550}
                logo={config.logoBase64 ? { uri: config.logoBase64 } : undefined}
                logoSize={120}
                logoBackgroundColor='#FFFFFF'
                logoMargin={5}
                ecl="H"
              />

              <View style={{ marginTop: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, color: '#64748B', fontWeight: '600', marginBottom: 10 }}>
                  Scan for Live Rates
                </Text>
                <Text style={{ fontSize: 20, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Powered by Karatpay
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",

  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  logo: {
    marginRight: 10,
  },
  glowBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    width: "100%",
  },
  topButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gstToggleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  gstToggle: {
    paddingHorizontal: 12,
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
    paddingHorizontal: 6,
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
    paddingVertical: 0,
  },
  animatedCardContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  card: {
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

  cardPrice: {
    fontSize: 28,
    fontWeight: "900", // Increased from previous value
    letterSpacing: -0.5,
    opacity: 0.95,
  },
  notificationFooter: {
    marginTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  announcementsContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 16,
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
    paddingTop: 16,
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
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  karatpayBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
  },
  karatpayIconBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D97706",
    justifyContent: "center",
    alignItems: "center",
  },
  karatpayText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 16,
  },
  announcementsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 6,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 24,
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    width: "85%",
    maxWidth: 340,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  qrShopName: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
    textAlign: "center",
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  qrActionRow: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  qrButton: {
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  qrButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  qrCloseIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
  },
});
