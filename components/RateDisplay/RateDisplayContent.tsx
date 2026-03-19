import { RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { getCalculatedEstimate } from "@/customHooks/useRateCalculations";
import { CATEGORIES, useDesignCatalog } from "@/customHooks/useRates";
import { Design } from "@/services/designService";
import { formatPrice, getContrastColor } from "@/utils/formatters";
import { Marquee } from "@animatereactnative/marquee";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  LayoutAnimation,
  Linking,
  Modal,
  Platform,
  Share as RNShare,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";

interface RateDisplayContentProps {
  config: RateConfig;
  calculatedRates: any;
  currentTime: Date;
  viewOnly?: boolean;
  previewMode?: boolean;
  withGST: boolean;
  onToggleGST: () => void;
  onShare: (tab?: string) => void;
  onSetupPress?: (tab: string) => void;
  shareUrl: string;
  gold999Change: ReturnType<typeof usePriceChange>;
  gold916Change: ReturnType<typeof usePriceChange>;
  silver999Change: ReturnType<typeof usePriceChange>;
  silver925Change: ReturnType<typeof usePriceChange>;
  retailerId?: string;
  initialDesignId?: string;
  initialTab?: 'rates' | 'designs';
}

/** Mix hex colour with white. amount=0 → original, amount=1 → white */
const lightenHex = (hex: string, amount: number): string => {
  const h = hex.replace('#', '');
  const parse = (i: number) =>
    parseInt(h.length === 3 ? h[i] + h[i] : h.substring(i * 2, i * 2 + 2), 16);
  const r = Math.round(parse(0) + (255 - parse(0)) * amount);
  const g = Math.round(parse(1) + (255 - parse(1)) * amount);
  const b = Math.round(parse(2) + (255 - parse(2)) * amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const DEFAULT_CARD_BG = '#FFFFFF'; // matches DEFAULT_CONFIG.cardBackgroundColor

const RateCard = React.memo(({
  label,
  price,
  priceColor,
  isGold,
  config,
  isMobile,
  isSmallMobile,
  previewMode = false,
  makingCharges,
  makingChargesTitle,
  makingChargeValue,
  makingChargeType,
  contrastColor,
}: {
  label: string;
  price: string;
  priceColor: string;
  isGold?: boolean;
  config: RateConfig;
  isMobile: boolean;
  isSmallMobile: boolean;
  previewMode?: boolean;
  makingCharges?: number;
  makingChargesTitle?: string;
  makingChargeValue?: number;
  makingChargeType?: "percentage" | "perGram";
  contrastColor: string;
}) => {
  const gradientColors: [string, string] = isGold
    ? ["#FFD700", "#F59E0B"]
    : ["#E2E8F0", "#94A3B8"];

  const labelFontSize = isSmallMobile ? 15 : isMobile ? 16 : 18;
  const priceFontSize = isSmallMobile ? 24 : isMobile ? 26 : 28;

  const isMinimal = config.fontTheme === "minimal";
  const labelWeight = isMinimal ? "600" : "700";
  const priceWeight = isMinimal ? "400" : "700";

  // Derive the effective card background:
  // - If user has set a CUSTOM cardBackgroundColor (not the default white), use it directly.
  // - Otherwise auto-compute a slightly lighter (or elevated) version of the page backgroundColor.
  const effectiveCardBg = useMemo(() => {
    const hasCustomCardBg =
      config.cardBackgroundColor &&
      config.cardBackgroundColor !== 'transparent' &&
      config.cardBackgroundColor.toUpperCase() !== DEFAULT_CARD_BG.toUpperCase();

    if (hasCustomCardBg) {
      if (config.cardBackgroundColor.startsWith('#')) {
        return `${config.cardBackgroundColor}F2`;
      }
      return config.cardBackgroundColor;
    }

    // Auto-derive from the page background:
    // Dark page → cards get a lighter elevated surface (~12% lighter)
    // Light page → cards get a very slightly off-white, clean surface
    const pageBg = config.backgroundColor || '#FFFDF5';
    if (pageBg.startsWith('#')) {
      if (contrastColor === '#FFFFFF') {
        // Dark page background: subtle lift
        return `${lightenHex(pageBg, 0.12)}F8`;
      } else {
        // Light page background: clean, crisp look
        return '#FFFFFFFB';
      }
    }
    return contrastColor === '#FFFFFF' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.98)';
  }, [config.cardBackgroundColor, config.backgroundColor, contrastColor]);

  // Contrast color for text on top of the card
  const cardContrastColor = useMemo(() => {
    if (effectiveCardBg.startsWith('#')) {
      return getContrastColor(effectiveCardBg.substring(0, 7));
    }
    return contrastColor;
  }, [effectiveCardBg, contrastColor]);

  return (
    <View style={[styles.animatedCardContainer, { marginBottom: previewMode ? 8 : 14 }]}>
      <Shadow
        distance={previewMode ? 6 : 12}
        startColor={contrastColor === "#FFFFFF" ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.05)"}
        offset={[0, previewMode ? 3 : 6]}
        style={{
          width: "100%",
          borderRadius: 20,
        }}
        containerStyle={{ width: "100%" }}
      >
        <View
          style={[
            styles.card,
            {
              borderRadius: 24,
              backgroundColor: effectiveCardBg,
              overflow: "hidden",
              flexDirection: "row",
              alignItems: 'center',
              paddingHorizontal: 22,
              paddingVertical: 18,
              borderWidth: 1,
              borderColor: contrastColor === "#FFFFFF" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <LinearGradient
            colors={isGold ? ["rgba(255, 215, 0, 0.15)", "rgba(255, 215, 0, 0.05)"] : ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.05)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <LinearGradient
            colors={isGold ? ["#F59E0B", "#B45309"] : ["#94A3B8", "#475569"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ 
              width: 6, 
              height: '100%', 
              maxHeight: 48,
              borderRadius: 3,
              marginRight: 16
            }}
          />

          <View style={[styles.cardContent, previewMode && { paddingVertical: 8 }]}>
            <View style={{ gap: 4, flex: 1 }}>
              <Text
                style={[
                  styles.cardLabel,
                  {
                    color: isGold 
                      ? (cardContrastColor === "#FFFFFF" ? "#FFD700" : "#B45309")
                      : (cardContrastColor === "#FFFFFF" ? "#E2E8F0" : "#475569"),
                    fontSize: labelFontSize,
                    marginBottom: 0,
                    fontWeight: "900",
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    textShadowColor: cardContrastColor === "#FFFFFF" ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 1,
                  },
                ]}
              >
                {label.split(' ')[0]} <Text style={{ 
                  color: isGold 
                    ? (cardContrastColor === "#FFFFFF" ? "#F59E0B" : "#92400E") 
                    : (cardContrastColor === "#FFFFFF" ? "#94A3B8" : "#1E293B"),
                  fontWeight: '400'
                }}>
                  {label.split(' ').slice(1).join(' ')}
                </Text>
              </Text>
              
              {config.makingChargesEnabled && makingChargeValue && makingChargeValue > 0 ? (
                <View style={[styles.mcBadge, { 
                  backgroundColor: isGold ? 'rgba(217, 119, 6, 0.08)' : 'rgba(71, 85, 105, 0.06)', 
                  borderColor: isGold ? 'rgba(217, 119, 6, 0.15)' : 'rgba(71, 85, 105, 0.15)', 
                  borderWidth: 1, 
                  alignSelf: 'flex-start',
                  marginTop: 2,
                  marginBottom: 6
                }]}>
                  <Text style={[styles.mcBadgeText, { color: isGold ? '#B45309' : '#475569', fontSize: 10, fontWeight: '700' }]}>
                    {makingChargeType === "percentage"
                      ? `${makingChargesTitle || 'MAKING'}: ${makingChargeValue}%`
                      : `${makingChargesTitle || 'MAKING'}: ₹${makingChargeValue}/G`}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.priceContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ 
                  fontSize: priceFontSize * 0.6, 
                  fontWeight: '700', 
                  color: isGold ? '#D97706' : (cardContrastColor === "#FFFFFF" ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'),
                  marginRight: 2
                }}>₹</Text>
                <Text
                  style={[
                    styles.cardPrice,
                    {
                      color: isGold 
                        ? (cardContrastColor === "#FFFFFF" ? "#FFB300" : "#D97706")
                        : cardContrastColor, 
                      fontSize: priceFontSize,
                      fontWeight: "900",
                    },
                  ]}
                >
                  {parseFloat(price.replace(/[^0-9.]/g, '')).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <Text style={{ 
                fontSize: 10, 
                color: cardContrastColor === "#FFFFFF" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", 
                fontWeight: '800',
                letterSpacing: 1,
                marginTop: -4
                }}>PER 10G</Text>
            </View>
          </View>
        </View>
      </Shadow>
    </View>
  );
});





// Design Card Component for Catalog
const DesignCard = React.memo(({ design, config, calculatedRates, onPress }: { design: Design, config: RateConfig, calculatedRates: any, onPress: (design: Design) => void }) => {
  const estimate = getCalculatedEstimate(design, calculatedRates);

  return (
    <TouchableOpacity style={styles.designCard} onPress={() => onPress(design)}>
      <View style={styles.designImageWrapper}>
        {design.imageUrl ? (
          <Image
            source={{ uri: design.imageUrl }}
            style={styles.designImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.designImagePlaceholder}>
            <MaterialCommunityIcons name="image-outline" size={32} color="#CBD5E1" />
            <View style={styles.designImageDecoration} />
          </View>
        )}
        
        {/* Badges Container */}
        <View style={styles.badgeContainer}>
          {design.isNew && (
            <View style={[styles.cardBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.cardBadgeText}>New</Text>
            </View>
          )}
          {design.tags && design.tags.map(tag => (
            <View key={tag} style={[styles.cardBadge, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.cardBadgeText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.designDetails}>
        <Text style={styles.designName} numberOfLines={1}>{design.name.toUpperCase()}</Text>
        <Text style={styles.designMeta} numberOfLines={1}>
          {design.type.toUpperCase()} • {design.purity.toUpperCase()}
          {design.netWeight ? ` • ${design.netWeight}g` : design.weight ? ` • ${design.weight}g` : ""}
        </Text>
        
        <View style={styles.cardPriceRow}>
          {design.priceDisplay === "Show Estimate" && estimate ? (
            <View style={{ flex: 1 }}>
              <Text style={styles.designPrice}>₹{estimate.toLocaleString('en-IN')}</Text>
              {design.makingCharge && (
                <View style={styles.catalogMcBadge}>
                  <Text style={styles.catalogMcText}>
                    {design.makingChargeType === "percentage" ? `+ ${design.makingCharge}% MC` : `+ ₹${design.makingCharge}/G MC`}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.priceOnRequest}>PRICE ON REQUEST</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Design Detail Modal Component
const DesignDetailModal = React.memo(({
  visible,
  onClose,
  design,
  config,
  calculatedRates,
  shareUrl
}: {
  visible: boolean;
  onClose: () => void;
  design: Design | null;
  config: RateConfig;
  calculatedRates: any;
  shareUrl: string;
}) => {
  if (!design) return null;

  // Build the design-specific shareable URL (routes through OG preview serverless function)
  const getDesignShareUrl = () => {
    // shareUrl is like: https://karatpay-retailers.vercel.app/view/{retailerId}
    // We need: https://karatpay-retailers.vercel.app/d/{retailerId}/{designId}
    const baseUrl = shareUrl.replace(/\/view\/[^/?#]+.*$/, '');
    return `${baseUrl}/d/${design.retailerId}/${design.id}`;
  };

  const handleWhatsAppEnquiry = () => {
    const rawPhone = config.shopPhone || "";
    let cleanPhone = rawPhone.replace(/[^0-9]/g, "");

    // Default to Indian country code if only 10 digits provided
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    if (!cleanPhone) {
      Alert.alert("Missing Contact", "No contact number is configured for this shop. Please ask the retailer to set up their WhatsApp number.");
      return;
    }

    const estimate = getCalculatedEstimate(design, calculatedRates);
    const designShareUrl = getDesignShareUrl();

    // Build a professional looking message
    const message = `Namasté 🙏

Inquiry for: *${design.name}*
━━━━━━━━━━━━━━
💍 Category: ${design.category}
💎 Purity: ${design.purity}
${design.sku ? `🔖 SKU: ${design.sku}\n` : ""}${design.grossWeight ? `⚖️ Gross Wt: ${design.grossWeight}g\n` : ""}${design.netWeight ? `⚖️ Net Wt: ${design.netWeight}g\n` : ""}${!design.grossWeight && !design.netWeight && design.weight ? `⚖️ Weight: ${design.weight}g\n` : ""}${design.stoneCharges ? `💎 Stone Chg: ₹${design.stoneCharges}\n` : ""}💰 *Price Est: ₹${estimate?.toLocaleString('en-IN') || "Requesting Price"}*

📝 Details: ${design.description || "Interested in this piece."}
${design.imageUrl && design.imageUrl.startsWith('http') ? `🖼️ View Photo: ${design.imageUrl}\n` : ""}
Sent from: ${config.shopName || "Karatpay Display"}
🔗 View Full Details: ${designShareUrl}

(Ref: ${design.id})`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // On web use window.open for reliable cross-browser behaviour;
    // on native, use Linking which deep-links into the WhatsApp app.
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.open) {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(whatsappUrl).catch(() => {
          Alert.alert('Error', 'Could not open WhatsApp. Please try again.');
        });
      }
    } else {
      Linking.openURL(whatsappUrl).catch(() => {
        Alert.alert('Error', 'Could not open WhatsApp. Please make sure the app is installed.');
      });
    }
  };

  const handleShareDesign = async () => {
    try {
      const estimate = getCalculatedEstimate(design, calculatedRates);
      const designShareUrl = getDesignShareUrl();

      const text = `Check out this design from ${config.shopName || 'our shop'}:
📌 *${design.name}*
💎 Purity: ${design.purity}
💰 Est. Price: ₹${estimate?.toLocaleString('en-IN') || "Price on request"}

View it here: ${designShareUrl}`;

      await RNShare.share({
        message: text,
        url: designShareUrl,
        title: design.name
      });
    } catch (error) {
      console.error("Error sharing design:", error);
    }
  };

  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const estimate = getCalculatedEstimate(design, calculatedRates);

  // Zoom state (web desktop only)
  const [isHovering, setIsHovering] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 0.5, y: 0.5 });

  // Zoom factor for the large preview panel
  const ZOOM_FACTOR = 2.8;
  // Lens square size as fraction of image (e.g. 0.36 = 36% of image dimensions)
  const LENS_F = 0.36;

  const handleMouseMove = (e: any) => {
    if (!isDesktop || !design.imageUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setZoomPos({ x, y });
  };

  // Clamped lens top-left corner (so lens never goes out of bounds)
  const lensLeft = Math.max(0, Math.min(1 - LENS_F, zoomPos.x - LENS_F / 2));
  const lensTop  = Math.max(0, Math.min(1 - LENS_F, zoomPos.y - LENS_F / 2));
  // The center of the lens in 0-1 space
  const focusX = lensLeft + LENS_F / 2;
  const focusY = lensTop  + LENS_F / 2;

  // CSS transition helper (web only)
  const wT = (d = '0.25s') =>
    Platform.OS === 'web' ? { transition: `opacity ${d} ease` } as any : {};

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalFullContainer}>

        {/* ── Top nav bar ─────────────────────────────────────────────── */}
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backToDesigns} onPress={onClose}>
            <Feather name="chevron-left" size={22} color="#333" />
            <Text style={styles.backToDesignsText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareDesign} style={styles.detailShareButton}>
            <Feather name="share-2" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailScrollContent}>
          <View style={[styles.dpRow, isDesktop && styles.dpRowDesktop]}>

            {/* ── LEFT ── Thumbnail image + hover lens ──────────────────── */}
            <View style={[styles.dpImagePanel, isDesktop && styles.dpImagePanelDesktop]}>
              <View
                style={[
                  styles.dpImageBox,
                  // Show zoom-in cursor on web desktop when image is present
                  Platform.OS === 'web' && isDesktop && design.imageUrl
                    ? ({ cursor: 'crosshair' } as any)
                    : {},
                ]}
                {...(Platform.OS === 'web' && isDesktop && design.imageUrl ? {
                  onMouseEnter: () => setIsHovering(true),
                  onMouseLeave: () => setIsHovering(false),
                  onMouseMove: handleMouseMove,
                } : {})}
              >
                {/* ── The actual product thumbnail ── */}
                {design.imageUrl ? (
                  <Image
                    source={{ uri: design.imageUrl }}
                    style={styles.dpImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.dpImagePlaceholder}>
                    <MaterialCommunityIcons name="image-outline" size={56} color="#CBD5E1" />
                    <Text style={{ color: '#CBD5E1', marginTop: 8, fontSize: 14 }}>No image</Text>
                  </View>
                )}

                {/* ── NEW badge ── */}
                {design.isNew && (
                  <View style={styles.dpNewBadge}>
                    <Text style={styles.dpNewBadgeText}>✦ NEW</Text>
                  </View>
                )}

                {/* ── Lens box that follows the cursor (web desktop only) ── */}
                {Platform.OS === 'web' && isHovering && isDesktop && design.imageUrl && (
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: `${lensLeft * 100}%`,
                      top:  `${lensTop  * 100}%`,
                      width:  `${LENS_F * 100}%`,
                      height: `${LENS_F * 100}%`,
                      borderWidth: 2,
                      borderColor: 'rgba(255,165,0,0.9)',
                      backgroundColor: 'rgba(255,165,0,0.08)',
                    } as any}
                  />
                )}

                {/* ── "Zoom" hint shown when NOT hovering ── */}
                {Platform.OS === 'web' && isDesktop && design.imageUrl && !isHovering && (
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>
                      🔍 Roll over image to zoom
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* ── RIGHT ── Shared column: text content vs zoom preview ──── */}
            <View style={[styles.dpContent, isDesktop && styles.dpContentDesktop]}>

              {/* ── Text content — fades OUT when hovering ── */}
              <View style={[
                { flex: 1 },
                Platform.OS === 'web' && isDesktop && design.imageUrl
                  ? ({ opacity: isHovering ? 0 : 1, ...wT() } as any)
                  : {},
              ]}>
                <Text style={[styles.dpTitle, isDesktop && styles.dpTitleDesktop]}>{design.name.toUpperCase()}</Text>
                <Text style={[styles.dpShopLink, isDesktop && styles.dpShopLinkDesktop]}>VISIT {config.shopName?.toUpperCase() || 'OUR SHOP'}</Text>
                <View style={styles.dpDivider} />

                <View style={styles.dpTagsRow}>
                  <View style={[styles.dpTag, { backgroundColor: '#E8F4FD', borderColor: '#9ED3F7' }]}>
                    <Text style={[styles.dpTagTxt, { color: '#1A6FA0' }]}>{design.type.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.dpTag, { backgroundColor: '#FEF0FB', borderColor: '#F0ACEA' }]}>
                    <Text style={[styles.dpTagTxt, { color: '#1A6FA0' }]}>{design.purity.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.dpTag, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}>
                    <Text style={[styles.dpTagTxt, { color: '#1A6FA0' }]}>{design.category.toUpperCase()}</Text>
                  </View>
                </View>

                {design.priceDisplay === "Show Estimate" && estimate ? (
                  <View style={styles.dpPriceBlock}>
                    <View style={styles.dpLivePill}>
                      <View style={styles.dpLiveDot} />
                      <Text style={styles.dpLiveText}>CERTIFIED LIVE RATE</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 }}>
                      <Text style={{ fontSize: 20, color: '#334155', fontWeight: '800', marginRight: 4 }}>₹</Text>
                      <Text style={styles.dpPrice}>{estimate.toLocaleString('en-IN')}</Text>
                    </View>
                    <Text style={styles.dpPriceSub}>Inclusive of all taxes · Calculation based on current live market price</Text>
                    
                    <View style={styles.dpDividerSmall} />
                    
                    <View style={styles.dpSpecsTable}>
                      {design.sku ? (
                        <View style={styles.dpSpecRow}>
                          <Text style={styles.dpSpecKey}>SERIAL / SKU</Text>
                          <Text style={styles.dpSpecVal}>{design.sku}</Text>
                        </View>
                      ) : null}
                      {design.grossWeight || design.weight ? (
                        <View style={styles.dpSpecRow}>
                          <Text style={styles.dpSpecKey}>GROSS MASS</Text>
                          <Text style={styles.dpSpecVal}>{design.grossWeight || design.weight} G</Text>
                        </View>
                      ) : null}
                      {design.netWeight ? (
                        <View style={styles.dpSpecRow}>
                          <Text style={styles.dpSpecKey}>NET MASS</Text>
                          <Text style={styles.dpSpecVal}>{design.netWeight} G</Text>
                        </View>
                      ) : null}
                      {design.makingCharge ? (
                        <View style={styles.dpSpecRow}>
                          <Text style={styles.dpSpecKey}>{config.makingCharges22kTitle || 'MAKING'}</Text>
                          <Text style={styles.dpSpecVal}>
                            {design.makingChargeType === 'percentage'
                              ? `${design.makingCharge}% OF RATE`
                              : `₹${design.makingCharge} / G`}
                          </Text>
                        </View>
                      ) : null}
                      {design.stoneCharges ? (
                        <View style={styles.dpSpecRow}>
                          <Text style={styles.dpSpecKey}>STONE CHARGES</Text>
                          <Text style={styles.dpSpecVal}>₹{parseFloat(design.stoneCharges).toLocaleString('en-IN')}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={styles.dpPOR}>
                    <Text style={styles.dpPORTitle}>PRICE ON REQUEST</Text>
                    <Text style={styles.dpPORSub}>Experience this piece in person at our lounge</Text>
                  </View>
                )}

                {design.description ? (
                  <View style={styles.dpDescBlock}>
                    <Text style={styles.dpDescLabel}>CRAFTSMANSHIP & STORY</Text>
                    <Text style={[styles.dpDescText, isDesktop && styles.dpDescTextDesktop]}>{design.description}</Text>
                  </View>
                ) : null}

                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={styles.dpWhatsApp} 
                  onPress={handleWhatsAppEnquiry}
                >
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#FFF" />
                  <Text style={styles.dpWhatsAppTxt}>SECURE ENQUIRY</Text>
                </TouchableOpacity>

                <Text style={styles.dpCaution}>
                  * Final acquisition price is subject to actual measurements and spot market rates at the time of purchase.
                </Text>
              </View>

              {/* ── Large zoom preview — fades IN when hovering (web desktop + image only) ── */}
              {Platform.OS === 'web' && isDesktop && design.imageUrl && (
                <View
                  pointerEvents="none"
                  style={[
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      overflow: 'hidden',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#E2E8F0',
                      backgroundColor: '#FFF',
                    },
                    { opacity: isHovering ? 1 : 0, ...wT() } as any,
                  ]}
                >
                  {/* The zoomed image — positioned so focusX/focusY appears at centre */}
                  <Image
                    source={{ uri: design.imageUrl }}
                    style={{
                      position: 'absolute',
                      width: `${ZOOM_FACTOR * 100}%`,
                      height: `${ZOOM_FACTOR * 100}%`,
                      // shift so that focus point is centred in the panel
                      left: `${(0.5 - focusX * ZOOM_FACTOR) * 100}%`,
                      top:  `${(0.5 - focusY * ZOOM_FACTOR) * 100}%`,
                    } as any}
                    resizeMode="cover"
                  />
                </View>
              )}

            </View>
            {/* ── end right column ── */}

          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
});

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
  retailerId,
  initialDesignId,
  initialTab,
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 420;
  const isSmallMobile = width < 360;

  // Ensure targetRetailerId is a trimmed string to avoid mismatch during fetch
  const targetRetailerId = String(retailerId || "").trim();

  const {
    designs,
    filteredDesigns,
    availableCategories,
    loading: designsLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useDesignCatalog(targetRetailerId);

  useEffect(() => {
  }, [targetRetailerId, designs.length, designsLoading]);

  const qrLogoSource = useMemo(() => {
    if (!config.logoBase64) return undefined;
    return { uri: config.logoBase64 };
  }, [config.logoBase64]);

  const [activeTab, setActiveTabRaw] = useState<'rates' | 'designs'>(initialTab || 'rates');
  const setActiveTab = (tab: 'rates' | 'designs') => {
    if (Platform.OS !== 'web') {
      const customAnim = {
        duration: 250,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      };
      LayoutAnimation.configureNext(customAnim);
    }
    setActiveTabRaw(tab);
  };
  const headerAnim = useRef(new Animated.Value(activeTab === 'designs' ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: activeTab === 'designs' ? 1 : 0,
      duration: 350,
      useNativeDriver: false, // Font size and dimensions don't support native driver
    }).start();
  }, [activeTab]);

  const animatedLogoSize = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      previewMode ? (config.logoSize || 80) * 0.8 : (config.logoSize || 80),
      previewMode ? (config.logoSize || 80) * 0.4 : (config.logoSize || 80) * 0.5
    ]
  });

  const animatedFontSize = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      previewMode ? 20 : 26,
      previewMode ? 16 : 18
    ]
  });

  const animatedHeaderPadding = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0]
  });
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const captureRef = useRef<any>(null);

  useEffect(() => {
    if (initialDesignId && designs.length > 0) {
      const rawId = Array.isArray(initialDesignId) ? initialDesignId[0] : initialDesignId;
      const designId = String(rawId).trim();
      const targetDesign = designs.find(d => d.id === designId);
      if (targetDesign) {
        setSelectedDesign(targetDesign);
        setShowDetailModal(true);
        setActiveTab('designs');
      }
    }
  }, [initialDesignId, designs]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleDesignPress = useCallback((d: Design) => {
    setSelectedDesign(d);
    setShowDetailModal(true);
  }, []);

  const handleDownloadQR = useCallback(async () => {
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
    }
  }, [config.shopName]);

  const enabledNotifications = useMemo(
    () => (config.notifications || []).filter((n) => n.enabled),
    [config.notifications]
  );

  const orderedRateItems = useMemo(() => {
    const rateItemsByKey: Record<string, {
      key: string; visible: boolean; label: string; price: number; isGold: boolean;
      makingCharges?: number; makingChargesTitle?: string; makingChargeValue?: number; makingChargeType?: "percentage" | "perGram";
    } | undefined> = {
      gold24k: { key: "gold24k", visible: Boolean(config.showGold24k), label: config.gold24kLabel || "24K Gold", price: calculatedRates?.gold999?.finalPrice ?? 0, isGold: true, makingCharges: calculatedRates?.gold999?.makingCharges, makingChargesTitle: config.makingCharges24kTitle || "MAKING CHARGE", makingChargeValue: config.makingCharges24kValue, makingChargeType: config.makingCharges24kType },
      gold22k: { key: "gold22k", visible: Boolean(config.showGold22k), label: config.gold22kLabel || "22K Gold", price: calculatedRates?.gold916?.finalPrice ?? 0, isGold: true, makingCharges: calculatedRates?.gold916?.makingCharges, makingChargesTitle: config.makingCharges22kTitle || "MAKING CHARGE", makingChargeValue: config.makingCharges22kValue, makingChargeType: config.makingCharges22kType },
      gold20k: { key: "gold20k", visible: Boolean(config.showGold20k), label: config.gold20kLabel || "20K Gold", price: calculatedRates?.gold20k?.finalPrice ?? 0, isGold: true, makingCharges: calculatedRates?.gold20k?.makingCharges, makingChargesTitle: config.makingCharges20kTitle || "MAKING CHARGE", makingChargeValue: config.makingCharges20kValue, makingChargeType: config.makingCharges20kType },
      gold18k: { key: "gold18k", visible: Boolean(config.showGold18k), label: config.gold18kLabel || "18K Gold", price: calculatedRates?.gold18k?.finalPrice ?? 0, isGold: true, makingCharges: calculatedRates?.gold18k?.makingCharges, makingChargesTitle: config.makingCharges18kTitle || "MAKING CHARGE", makingChargeValue: config.makingCharges18kValue, makingChargeType: config.makingCharges18kType },
      gold14k: { key: "gold14k", visible: Boolean(config.showGold14k), label: config.gold14kLabel || "14K Gold", price: calculatedRates?.gold14k?.finalPrice ?? 0, isGold: true, makingCharges: calculatedRates?.gold14k?.makingCharges, makingChargesTitle: config.makingCharges14kTitle || "MAKING CHARGE", makingChargeValue: config.makingCharges14kValue, makingChargeType: config.makingCharges14kType },
      silver999: { key: "silver999", visible: Boolean(config.showSilver999), label: config.silver999Label || "Pure Silver", price: calculatedRates?.silver999?.finalPrice ?? 0, isGold: false, makingCharges: calculatedRates?.silver999?.makingCharges, makingChargesTitle: config.makingCharges999Title || "MAKING CHARGE", makingChargeValue: config.makingCharges999Value, makingChargeType: config.makingCharges999Type },
      silver925: { key: "silver925", visible: Boolean(config.showSilver925), label: config.silver925Label || "925 Silver", price: calculatedRates?.silver925?.finalPrice ?? 0, isGold: false, makingCharges: calculatedRates?.silver925?.makingCharges, makingChargesTitle: config.makingCharges925Title || "MAKING CHARGE", makingChargeValue: config.makingCharges925Value, makingChargeType: config.makingCharges925Type },
    };

    const defaultOrder = ["gold24k", "gold22k", "silver999", "silver925", "gold20k", "gold18k", "gold14k"];
    let items = (config.purityOrder?.length ? config.purityOrder : defaultOrder)
      .map((k) => rateItemsByKey[k])
      .filter(Boolean)
      .filter((item) => item!.visible) as Array<{
        key: string; label: string; price: number; isGold: boolean;
        makingCharges?: number; makingChargesTitle?: string; makingChargeValue?: number; makingChargeType?: "percentage" | "perGram";
      }>;

    if (previewMode) {
      items = [
        ...items.filter(item => item.isGold).slice(0, 2),
        ...items.filter(item => !item.isGold).slice(0, 2),
      ];
    }
    return items;
  }, [config, calculatedRates, previewMode]);

  const headerDirection = config.brandAlignment === "right" ? "row-reverse" : "row";
  const contentAlignItems = config.brandAlignment === "center" ? "center" : config.brandAlignment === "right" ? "flex-end" : "flex-start";
  const textAlign = config.brandAlignment === "center" ? "center" : config.brandAlignment === "right" ? "right" : "left";

  const SafeContainer = previewMode ? View : SafeAreaView;


    const bgBase = config.backgroundColor || "#FFFDF5";
    const contrastColor = getContrastColor(bgBase);

    return (
      <LinearGradient
        colors={[bgBase, config.backgroundColor ? bgBase : "#FDF1E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
      <SafeContainer style={{ flex: 1 }}>
        <View style={[styles.headerContainer, previewMode && { paddingBottom: 8, paddingTop: 5 }]}>
          {!previewMode && (
            <View style={styles.topButtonRow}>
              <TouchableOpacity
                style={[
                  styles.iconButton, 
                  { 
                    marginRight: 8,
                    backgroundColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                    borderColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.1)"
                  }
                ]}
                onPress={() => setShowQRModal(true)}
              >
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={20}
                  color={contrastColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconButton, 
                  { 
                    backgroundColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                    borderColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.1)"
                  }
                ]}
                onPress={() => onShare(activeTab)}
              >
                <Feather
                  name="share-2"
                  size={20}
                  color={contrastColor}
                />
              </TouchableOpacity>

              {!viewOnly && onSetupPress && (
                <TouchableOpacity
                  style={[
                    styles.iconButton, 
                    { 
                      marginLeft: 8,
                      backgroundColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.05)",
                      borderColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.1)"
                    }
                  ]}
                  onPress={() => onSetupPress(activeTab)}
                >
                  <Feather
                    name="settings"
                    size={20}
                    color={contrastColor}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <Animated.View style={[styles.centerContent, previewMode && { marginBottom: 8 }, { marginBottom: animatedHeaderPadding }]}>
            {config.logoBase64 && (
              <Animated.Image
                source={{ uri: config.logoBase64 }}
                style={{
                  width: animatedLogoSize,
                  height: animatedLogoSize,
                  opacity: config.logoOpacity ?? 1,
                  marginBottom: previewMode ? 4 : 8,
                }}
                resizeMode="contain"
              />
            )}
            {config.showShopName && (
              <Animated.Text
                style={[
                  styles.brandName,
                  {
                    color: config.priceColor || contrastColor, // Use user selected color
                    fontSize: animatedFontSize,
                    textAlign: "center",
                    fontWeight: "900",
                    letterSpacing: -0.5,
                  },
                ]}
              >
                {config.shopName.toUpperCase()}
              </Animated.Text>
            )}

            <View style={[
              styles.tabContainer, 
              previewMode && { width: '95%', marginTop: 8 },
              { backgroundColor: contrastColor === "#FFFFFF" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.05)" }
            ]}>
              <TouchableOpacity
                onPress={() => setActiveTab('rates')}
                style={[
                  styles.tab,
                  activeTab === 'rates' && styles.activeTab,
                  activeTab === 'rates' && { backgroundColor: config.priceColor || "#C2410C" },
                  previewMode && { paddingVertical: 6 }
                ]}
              >
                <MaterialCommunityIcons 
                  name="trending-up" 
                  size={previewMode ? 14 : 18}
                  color={activeTab === 'rates' ? "#FFFFFF" : (contrastColor === "#FFFFFF" ? "rgba(255,255,255,0.4)" : "#94A3B8")} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === 'rates' && { color: "#FFFFFF" },
                  activeTab !== 'rates' && { color: (contrastColor === "#FFFFFF" ? "rgba(255,255,255,0.4)" : "#94A3B8") },
                  previewMode && { fontSize: 12 }
                ]}>
                  LIVE RATES
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab('designs')}
                style={[
                  styles.tab,
                  activeTab === 'designs' && styles.activeTab,
                  activeTab === 'designs' && { backgroundColor: config.priceColor || "#C2410C" },
                  previewMode && { paddingVertical: 6 }
                ]}
              >
                <MaterialCommunityIcons 
                  name="shopping-outline" 
                  size={previewMode ? 14 : 18}
                  color={activeTab === 'designs' ? "#FFFFFF" : (contrastColor === "#FFFFFF" ? "rgba(255,255,255,0.4)" : "#94A3B8")} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === 'designs' && { color: "#FFFFFF" },
                  activeTab !== 'designs' && { color: (contrastColor === "#FFFFFF" ? "rgba(255,255,255,0.4)" : "#94A3B8") },
                  previewMode && { fontSize: 12 }
                ]}>
                  DESIGNS
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            activeTab === 'rates' && orderedRateItems.length <= 3 && {
              flexGrow: 1,
              justifyContent: 'center', // Center content vertically
              paddingTop: previewMode ? 10 : 40 // Add space between header and cards
            },
            previewMode && { paddingBottom: 20 }
          ]}
        >
          {activeTab === 'rates' ? (
            <View style={[styles.grid, { marginHorizontal: 0 }]}>
              {orderedRateItems.map((item) => (
                <View key={item.key} style={[styles.gridItem, { paddingHorizontal: 0, marginBottom: 0 }]}>
                  <RateCard
                    label={item.label}
                    price={formatPrice(item.price)}
                    priceColor={
                      config.priceColor || (item.isGold ? "#E6A119" : "#2D3748")
                    }
                    isGold={item.isGold}
                    config={config}
                    isMobile={isMobile}
                    isSmallMobile={isSmallMobile}
                    previewMode={previewMode}
                    makingCharges={item.makingCharges}
                    makingChargesTitle={item.makingChargesTitle}
                    makingChargeValue={item.makingChargeValue}
                    makingChargeType={item.makingChargeType}
                    contrastColor={contrastColor}
                  />
                </View>
              ))}

              {viewOnly && !previewMode && (designs.length > 0 || designsLoading) && (
                <View style={styles.catalogTeaser}>
                  <View style={styles.separator} />
                  <Text style={styles.teaserTitle}>Explore Our Catalog</Text>
                  <Text style={styles.teaserSubtext}>Check out our latest collections and designs</Text>

                  {designsLoading ? (
                    <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="small" color={config.priceColor || "#D4AF37"} />
                    </View>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teaserGrid}>
                      {designs.slice(0, 5).map(design => (
                        <TouchableOpacity
                          key={design.id}
                          style={styles.teaserCard}
                          onPress={() => {
                            setSelectedDesign(design);
                            setShowDetailModal(true);
                            setActiveTab('designs');
                          }}
                        >
                          {design.imageUrl ? (
                            <Image source={{ uri: design.imageUrl }} style={styles.teaserImage} />
                          ) : (
                            <View style={[styles.teaserImage, { backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }]}>
                              <MaterialCommunityIcons name="image-outline" size={24} color="#CBD5E1" />
                            </View>
                          )}
                          <Text style={styles.teaserName} numberOfLines={1}>{design.name}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={styles.viewAllTeaser}
                        onPress={() => setActiveTab('designs')}
                      >
                        <View style={styles.viewAllIconCircle}>
                          <Feather name="arrow-right" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.viewAllTeaserText}>View All</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.designsTabContent}>
              {designsLoading ? (
                <View style={styles.designsLoading}>
                  <ActivityIndicator size="large" color={config.priceColor || "#D4AF37"} />
                  <Text style={styles.loadingText}>Loading collection...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.searchSection}>
                    <View style={styles.searchBarWrapper}>
                      <View style={styles.searchBar}>
                        <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                        <TextInput
                          placeholder="Search designs..."
                          placeholderTextColor="#94A3B8"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          style={styles.searchInput}
                        />
                      </View>
                      <TouchableOpacity style={styles.filterButton}>
                        <MaterialCommunityIcons name="filter-variant" size={24} color="#5D4037" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.categoryScroll}
                    >
                      {availableCategories.map(category => {
                        const isActive = selectedCategory === category;
                        const chipBg = isActive ? (config.priceColor || "#5D4037") : "rgba(255, 255, 255, 0.7)";
                        const textColor = isActive ? getContrastColor(chipBg) : "#5D4037";

                        return (
                          <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={[
                              styles.categoryChip,
                              isActive && { backgroundColor: chipBg, borderColor: chipBg }
                            ]}
                          >
                            <Text style={[
                              styles.categoryText,
                              { color: textColor }
                            ]}>
                              {category}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>


                  <View style={styles.designsGrid}>
                    {filteredDesigns.map(design => (
                      <DesignCard
                        key={design.id}
                        design={design}
                        config={config}
                        calculatedRates={calculatedRates}
                        onPress={handleDesignPress}
                      />
                    ))}
                    {filteredDesigns.length === 0 && (
                      <View style={styles.noResults}>
                        {designs.length === 0 ? (
                          <>
                            <MaterialCommunityIcons name="image-off-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.noResultsText}>No designs added by this retailer yet</Text>
                            {__DEV__ && (
                              <View style={{ marginTop: 8, alignItems: 'center' }}>
                                <Text style={{ fontSize: 10, color: '#94A3B8' }}>
                                  Target ID: {targetRetailerId}
                                </Text>
                                <Text style={{ fontSize: 10, color: '#94A3B8' }}>
                                  Total in designs collection: {(designs || []).length}
                                </Text>
                              </View>
                            )}
                          </>
                        ) : (
                          <>
                            <MaterialCommunityIcons name="magnify-close" size={48} color="#CBD5E1" />
                            <Text style={styles.noResultsText}>No designs match your search</Text>
                          </>
                        )}
                      </View>
                    )}
                  </View>

                </>
              )}
              <DesignDetailModal
                visible={showDetailModal}
                design={selectedDesign}
                config={config}
                calculatedRates={calculatedRates}
                shareUrl={shareUrl}
                onClose={() => setShowDetailModal(false)}
              />
            </View>
          )}

          {previewMode ? (
            <View style={styles.announcementsSection}>
              <View style={styles.announcementsHeader}>
                <MaterialCommunityIcons
                  name="bullhorn-outline"
                  size={16}
                  color={contrastColor}
                />
                <Text
                  style={[
                    styles.announcementsTitle,
                    { color: contrastColor },
                  ]}
                >
                  ANNOUNCEMENTS
                </Text>
              </View>
              <View style={styles.marqueeViewport}>
                <Marquee spacing={0} speed={0.5}>
                  <View style={[styles.notificationsRow, { paddingRight: width }]}>
                    {enabledNotifications.length > 0 ? (
                      enabledNotifications.map((n, index) => (
                        <View key={`preview-n-${index}`} style={styles.notificationPill}>
                          <View
                            style={[
                              styles.notificationDot,
                              { backgroundColor: config.priceColor || "#C2410C" },
                            ]}
                          />
                          <Text
                            style={[
                              styles.notificationText,
                              { color: contrastColor },
                            ]}
                          >
                            {n.message}
                          </Text>
                        </View>
                      ))
                    ) : (
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
                    )}
                  </View>
                </Marquee>
              </View>
            </View>
          ) : (
            (config.notifications?.some((n) => n.enabled) ||
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
                      <Marquee spacing={0} speed={0.5}>
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
                      <Image
                        source={require('../../assets/images/karatpay.png')}
                        style={styles.karatpayIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.karatpayText}>Karatpay</Text>
                  </View>
                </View>
              </View>
            )
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
                logo={qrLogoSource}
                logoSize={50}
                logoBackgroundColor='#FFFFFF'
                logoMargin={2}
                ecl="H"
              />
            </View>

            <View style={styles.poweredByContainer}>
              <Text style={styles.poweredByLabel}>Powered by</Text>
              <View style={styles.karatpayBadge}>
                <View style={styles.karatpayIconBox}>
                  <Image
                    source={require('../../assets/images/karatpay.png')}
                    style={styles.karatpayIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.karatpayText}>Karatpay</Text>
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
                logo={qrLogoSource}
                logoSize={120}
                logoBackgroundColor='#FFFFFF'
                logoMargin={5}
                ecl="H"
              />

              <View style={{ marginTop: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, color: '#64748B', fontWeight: '600', marginBottom: 10 }}>
                  Scan for Live Rates
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 22, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Powered by
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image
                      source={require('../../assets/images/karatpay.png')}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                    <Text style={{ fontSize: 26, color: '#64748B', fontWeight: '800' }}>
                      Karatpay
                    </Text>
                  </View>
                </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  gstToggleText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#78350F",
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
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
    justifyContent: "center",
  },
  gridItem: {
    width: "100%",
    maxWidth: 800,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignSelf: "center",
  },
  animatedCardContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
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
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  cardPrice: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
    opacity: 1,
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
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  karatpayIcon: {
    width: 20,
    height: 20,
  },
  karatpayText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mcBadge: {
    marginTop: 4,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  mcBadgeText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  catalogMcBadge: {
    marginTop: 4,
    backgroundColor: "rgba(180, 83, 9, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(180, 83, 9, 0.15)",
    alignSelf: "flex-start",
  },
  catalogMcText: {
    fontSize: 9,
    color: "#B45309",
    fontWeight: "800",
    textTransform: "uppercase",
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 32,
    padding: 4,
    marginTop: 16,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
  },
  designsContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designsPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  designsPlaceholderText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#475569',
    marginTop: 16,
  },
  designsSubText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  designsTabContent: {
    paddingTop: 16,
  },
  searchSection: {
    gap: 16,
    marginBottom: 16,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryScroll: {
    paddingRight: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#5D4037',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 16,
  },
  designsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    marginTop: 8,
    paddingTop: 8,
  },
  designCard: {
    width: Platform.OS === 'web' ? 'auto' : '47.5%',
    minWidth: 140,
    maxWidth: Platform.OS === 'web' ? 220 : undefined,
    flex: Platform.OS === 'web' ? 1 : undefined,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 4,
  },
  designImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  designImage: {
    width: '100%',
    height: '100%',
  },
  designImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designImageDecoration: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 100,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  cardMC: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  designDetails: {
    padding: 12,
  },
  designName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  designMeta: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceOnRequest: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  noResults: {
    width: '100%',
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modalFullContainer: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  detailHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FAF9F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  detailMainWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 40,
  },
  detailMainWrapperDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: '4%',
    maxWidth: 1600,
    alignSelf: 'center',
    gap: 32,
  },
  detailImageContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
  },
  detailImageContainerDesktop: {
    width: '38%',
    maxWidth: 500,
    padding: 0,
    backgroundColor: 'transparent',
    position: 'sticky',
    top: 40,
  },
  imageCardOuter: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    aspectRatio: 1,
  },
  detailInfoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  detailInfoSectionDesktop: {
    width: '34%',
    paddingHorizontal: 0,
    marginTop: 0,
  },
  actionColumn: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionColumnDesktop: {
    width: '24%',
    maxWidth: 340,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  actionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  detailName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#332211',
    marginBottom: 8,
    lineHeight: 32,
  },
  brandSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandSubtext: {
    fontSize: 14,
    color: '#64748B',
  },
  brandHighlight: {
    fontSize: 14,
    color: '#C2410C',
    fontWeight: '700',
  },
  dpDividerSmall: {
    height: 1,
    width: 60,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    marginTop: 24,
  },
  detailDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    opacity: 0.9,
  },
  tagsContainer: {
    marginTop: 24,
  },
  priceSection: {
    marginBottom: 16,
  },
  inclusiveText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailPlaceholder: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  detailPlaceholderCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeLarge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  newBadgeTextLarge: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  detailTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  detailTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  detailTagText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceRequestCardInner: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  priceRequestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#332211',
    marginBottom: 4,
  },
  priceRequestSubtext: {
    fontSize: 14,
    color: '#64748B',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  whatsappButton: {
    backgroundColor: '#1EAD54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#1EAD54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  designPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 4,
  },
  estimateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  estimateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EF4444',
  },
  estimateValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#332211',
    marginBottom: 4,
  },
  estimateCaution: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  detailShareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backToDesigns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backToDesignsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5D4037',
  },
  /* ===== DESIGN DETAIL PAGE STYLES ===== */
  dpRow: {
    flexDirection: 'column',
  },
  dpRowDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    gap: 32,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  dpImagePanel: {
    backgroundColor: '#F4F4F2',
  },
  dpImagePanelDesktop: {
    width: '22%',
    position: 'sticky',
    top: 0,
  },
  dpImageBox: {
    aspectRatio: 1,
    backgroundColor: '#F8F8F5',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    margin: 8,
  },
  dpImage: {
    width: '100%',
    height: '100%',
  },
  dpImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1EE',
  },
  dpNewBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 10,
  },
  dpNewBadgeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dpContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  dpContentDesktop: {
    flex: 1,
    paddingHorizontal: 0,
    minHeight: 520,
    position: 'relative',
    justifyContent: 'space-between',
  },
  dpTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    lineHeight: 34,
    marginBottom: 6,
  },
  dpTitleDesktop: {
    fontSize: 34,
    lineHeight: 42,
    marginBottom: 10,
  },
  dpShopLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 16,
  },
  dpShopLinkDesktop: {
    fontSize: 16,
    marginBottom: 24,
  },
  dpDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 16,
  },
  dpTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dpTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  dpTagTxt: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dpPriceBlock: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFBF0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dpLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dpLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  dpLiveText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  dpPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111',
    marginBottom: 2,
  },
  dpPriceSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  dpSpecsTable: {
    gap: 0,
  },
  dpSpecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3E8A0',
  },
  dpSpecKey: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  dpSpecVal: {
    fontSize: 13,
    color: '#111',
    fontWeight: '700',
  },
  dpPOR: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dpPORTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  dpPORSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  dpWhatsApp: {
    backgroundColor: '#1EAD54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
    marginBottom: 10,
    shadowColor: '#1EAD54',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dpWhatsAppTxt: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dpDescBlock: {
    marginBottom: 24,
  },
  dpDescLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 6,
  },
  dpDescText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  dpDescTextDesktop: {
    fontSize: 17,
    lineHeight: 28,
  },
  dpTagsBlock: {
    marginBottom: 24,
  },
  dpFeaturePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dpFeaturePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  dpFeaturePillTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  dpCaution: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
    marginTop: 8,
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  designsLoading: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  catalogTeaser: {
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  teaserTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5D4037',
    marginTop: 16,
    marginBottom: 4,
  },
  teaserSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    fontWeight: '500',
  },
  teaserGrid: {
    flexDirection: 'row',
  },
  teaserCard: {
    width: 100,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  teaserImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  teaserName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
    textAlign: 'center',
  },
  viewAllTeaser: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  viewAllIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllTeaserText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
});
