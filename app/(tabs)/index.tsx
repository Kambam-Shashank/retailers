import { WEBSOCKET_URL } from "@/config/api";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useRateConfig } from "../../contexts/RateConfigContext";
import { useAaravRates } from "../../customHooks/useAaravRates";
import { usePriceChange } from "../../customHooks/usePriceChange";
import { useRateCalculations } from "../../customHooks/useRateCalculations";
import useWebSocket, { GoldPriceData } from "../../customHooks/useWebSocket";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [withGST, setWithGST] = useState(false);
  const [cachedWsData, setCachedWsData] = useState<GoldPriceData | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const { config } = useRateConfig();
  const { data: aaravRates } = useAaravRates();

  // Console log Aarav API data
  useEffect(() => {
    console.log('=== AARAV API DATA ===>', {
      silver: aaravRates.silver,
      gold: aaravRates.gold,
      silverWithGST: aaravRates.silverWithGST,
      goldWithGST: aaravRates.goldWithGST,
    });
  }, [aaravRates]);

  const calculatedRates = useRateCalculations(
    cachedWsData,
    withGST,
    aaravRates.silver,
    undefined,
    aaravRates.silverWithGST,
    false
  );

  // Track price changes for all metals
  const gold999Change = usePriceChange(calculatedRates.gold999.finalPrice);
  const gold916Change = usePriceChange(calculatedRates.gold916.finalPrice);
  const silver999Change = usePriceChange(calculatedRates.silver999.finalPrice);
  const silver925Change = usePriceChange(calculatedRates.silver925.finalPrice);

  const {
    data: wsData,
    isConnected,
    error,
    sendMessage,
  } = useWebSocket(WEBSOCKET_URL);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (wsData && !config.ratesFrozen) {
      setCachedWsData(wsData);
    }
  }, [wsData, config.ratesFrozen]);

  useEffect(() => {
    if (wsData && !cachedWsData) {
      setCachedWsData(wsData);
    }
  }, [wsData, cachedWsData]);

  // Console log calculated rates when they change
  useEffect(() => {
    console.log('=== CALCULATED RATES ===> ', {
      withGST,
      gold999: calculatedRates.gold999,
      gold916: calculatedRates.gold916,
      silver999: calculatedRates.silver999,
      silver925: calculatedRates.silver925,
    });
  }, [calculatedRates, withGST]);

  const formatPricePerGram = (price: number) => {
    const decimals = config.priceDecimalPlaces ?? 0;
    const perGram = price / 10;
    return `₹${perGram.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const onToggleGST = () => {
    const newGSTState = !withGST;
    console.log('=== GST TOGGLE PRESSED ===> ', {
      previousState: withGST,
      newState: newGSTState,
    });
    setWithGST(newGSTState);
  };

  const onShare = async () => {
    try {
      // Determine the base URL
      let baseUrl = "https://karatpay-retailers.vercel.app";
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        baseUrl = window.location.origin;
      }

      const result = await Share.share({
        message: `Gold & Silver Live Rates\n\nGold 999 (per gram): ${formatPricePerGram(calculatedRates.gold999.finalPrice)}\nSilver (per gram): ${formatPricePerGram(calculatedRates.silver999.finalPrice)}\n\nCheck live rates here: ${baseUrl}/rates?viewOnly=true`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

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
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor || "#000000" },
      ]}
    >
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        {/* MOBILE HEADER LAYOUT (Column) */}
        {!isDesktop && (
          <View style={{ width: '100%', gap: 15 }}>
            {/* Row 1: Branding (Centered) */}
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {config.logoBase64 && config.logoPlacement === 'header' && (
                <Image
                  source={{ uri: config.logoBase64 }}
                  style={{ width: config.logoSize, height: config.logoSize, marginBottom: 10 }}
                  resizeMode="contain"
                />
              )}
              {config.showShopName && (
                <Text
                  style={[
                    styles.shopName,
                    { color: config.textColor || "#FFFFFF", textAlign: "center", fontSize: 28 },
                    config.fontTheme === "serif" && { fontFamily: "serif" },
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
                  ]}
                >
                  {config.shopName || "Karatpay"}
                </Text>
              )}
            </View>

            {/* Row 2: Controls & Time */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>

              {/* Left Side: Time (if enabled) */}
              <View>
                {config.showTime && (
                  <Text style={[styles.time, { color: config.textColor || "#FFFFFF", fontSize: 16 }]}>
                    {formatTime(currentTime)}
                  </Text>
                )}
              </View>

              {/* Right Side: Tools */}
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={onShare} style={[styles.shareButton, { paddingHorizontal: 10, paddingVertical: 6 }]}>
                  <Text style={[styles.shareButtonText, { fontSize: 12 }]}>Share</Text>
                </TouchableOpacity>

                <View style={styles.gstToggle}>
                  <Text style={[styles.gstText, { color: config.textColor || "#FFFFFF", fontSize: 12 }]}>
                    {withGST ? "GST On" : "GST Off"}
                  </Text>
                  <TouchableOpacity
                    style={[styles.toggle, withGST && styles.toggleActive, { width: 36, height: 20 }]}
                    onPress={onToggleGST}
                  >
                    <View style={[styles.toggleCircle, withGST && { transform: [{ translateX: 16 }] }, { width: 18, height: 18, borderRadius: 9 }]} />
                  </TouchableOpacity>
                </View>

                {/* Settings icon removed from here as it's now in tabs */}
              </View>
            </View>
          </View>
        )}

        {/* DESKTOP HEADER LAYOUT (Row) */}
        {isDesktop && (
          <>
            <View style={[styles.leftSection, { alignItems: "flex-start" }]}>

              {config.brandAlignment === "left" && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {config.logoBase64 && config.logoPlacement === 'header' && (
                    <Image
                      source={{ uri: config.logoBase64 }}
                      style={[styles.shopLogo, { width: config.logoSize, height: config.logoSize }]}
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
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
                  ]}
                >
                  {formatTime(currentTime)}
                </Text>
              )}
            </View>
            <View style={[styles.centerSection, { flexDirection: isDesktop ? "row" : "column", gap: 10 }]}>
              {config.brandAlignment === "center" && (
                <>
                  {config.logoBase64 && config.logoPlacement === 'header' && (
                    <Image
                      source={{ uri: config.logoBase64 }}
                      style={[styles.shopLogo, { width: config.logoSize, height: config.logoSize }, !isDesktop && { marginBottom: 10 }]}
                      resizeMode="contain"
                    />
                  )}
                  {config.showShopName && (
                    <Text
                      style={[
                        styles.shopName,
                        { color: config.textColor || "#FFFFFF", textAlign: "center" },
                        config.fontTheme === "serif" && { fontFamily: "serif" },
                        config.fontTheme === "classic" && {
                          fontFamily: "monospace",
                        },
                        !isDesktop && { fontSize: 26 }
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
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
                        { color: config.textColor || "#FFFFFF", marginRight: 12 },
                        config.fontTheme === "serif" && { fontFamily: "serif" },
                        config.fontTheme === "classic" && {
                          fontFamily: "monospace",
                        },
                      ]}
                    >
                      {config.shopName || "Karatpay"}
                    </Text>
                  )}
                  {config.logoBase64 && config.logoPlacement === 'header' && (
                    <Image
                      source={{ uri: config.logoBase64 }}
                      style={[styles.shopLogo, { width: config.logoSize, height: config.logoSize }]}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.headerIcons}>
                  <TouchableOpacity onPress={onShare} style={styles.shareButton}>
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
            {
              backgroundColor: config.backgroundColor || "#FFFFFF",
              borderRadius: config.cardBorderRadius ?? 16,
              borderWidth: config.cardBorderWidth ?? 1,
              borderColor: config.cardBorderColor || "#EEEEEE",
            },
          ]}
        >
          {/* Card Header from Reference Image */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.livePriceHeader}>Live Gold Price</Text>
          </View>

          {config.showTime && (
            <Text style={[styles.cardTime, { color: config.textColor || "#666" }]}>
              {formatTime(currentTime).split(',')[0]} {/* Assuming format includes time */}
            </Text>
          )}

          {config.logoBase64 && config.logoPlacement === 'card' && (
            <View style={{ alignItems: 'center', marginBottom: 15, opacity: config.logoOpacity }}>
              <Image
                source={{ uri: config.logoBase64 }}
                style={{ width: config.logoSize * 1.5, height: config.logoSize * 1.5 }}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.price,
                    { color: config.priceColor || "#D4AF37" },
                    config.fontTheme === "serif" && { fontFamily: "serif" },
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.price,
                    { color: config.priceColor || "#D4AF37" },
                    config.fontTheme === "serif" && { fontFamily: "serif" },
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.price,
                    { color: config.priceColor || "#D4AF37" },
                    config.fontTheme === "serif" && { fontFamily: "serif" },
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.price,
                    { color: config.priceColor || "#D4AF37" },
                    config.fontTheme === "serif" && { fontFamily: "serif" },
                    config.fontTheme === "classic" && { fontFamily: "monospace" },
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
              <Text style={styles.footerShopName}>{config.shopName || "Karatpay"}</Text>
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
      {
        config.notifications && config.notifications.some(n => n.enabled) && (
          <View style={styles.notificationFooter}>
            <Text style={styles.notificationText} numberOfLines={1}>
              {config.notifications
                .filter(n => n.enabled)
                .map(n => n.message)
                .join("  •  ")}
            </Text>
          </View>
        )
      }
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 16,
    backgroundColor: "transparent",
    flexWrap: "wrap", // Allow wrapping on very small screens
  },
  headerDesktop: {
    paddingHorizontal: 40,
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
    backgroundColor: "#D4AF37",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  shareButtonText: {
    color: "#000",
    fontWeight: "700",
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
    borderColor: "#D4AF37",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  livePriceHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D4AF37", // Gold as per image
  },
  cardTime: {
    fontSize: 14,
    marginBottom: 20,
  },
  metalType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
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
  makingChargesRow: {
    fontSize: 12,
    color: "#A1A1A1",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  makingChargesBig: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D4AF37", // Gold color for importance
    marginTop: 5,
  },
  notificationFooter: {
    padding: 15,
    backgroundColor: "transparent",
    marginTop: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "600",
  },
  shopDetailsFooter: {
    marginTop: 40,
    padding: 30,
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
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
});

export default Index;
