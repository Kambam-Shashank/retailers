import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NotificationConfig,
  RateConfig,
} from "../../contexts/RateConfigContext";
import { useRateSetupNotifications } from "../../customHooks/useRateSetupNotifications";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#666666";

interface ShopBrandingCardProps {
  shopName: string;
  address?: string;
  phone?: string;
  logoBase64: string | null;
  logoSize: number;
  logoPlacement?: "header" | "card";
  logoOpacity?: number;
  brandAlignment: "left" | "center" | "right";
  onShopNameChange: (text: string) => void;
  onShopNameBlur: () => void;
  onPickLogo: () => void;
  onDeleteLogo: () => void;
  onUpdate: (updates: Partial<RateConfig>) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

export const ShopBrandingCard = ({
  shopName,
  address = "",
  phone = "",
  logoBase64,
  logoSize,
  brandAlignment,
  onShopNameChange,
  onShopNameBlur,
  onPickLogo,
  onDeleteLogo,
  onUpdate,
  isMobile = false,
  isSmallMobile = false,
}: ShopBrandingCardProps) => {
  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 17 : 18;
  const labelFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;
  const inputFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;
  const buttonFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;

  return (
    <View style={brandingStyles.card}>
      <View style={brandingStyles.cardHeader}>
        <MaterialCommunityIcons name="storefront" size={24} color={GOLD} />
        <Text
          style={[brandingStyles.cardTitle, { fontSize: cardTitleFontSize }]}
        >
          Shop Branding
        </Text>
      </View>

      <View style={brandingStyles.formContent}>
        <View style={brandingStyles.shopNameRow}>
          <View style={{ width: "100%" }}>
            <Text style={[brandingStyles.label, { fontSize: labelFontSize }]}>
              Shop Name *
            </Text>
            <View style={brandingStyles.inputWrapper}>
              <TextInput
                placeholder="Enter shop name"
                placeholderTextColor="#A3A3A3"
                style={[brandingStyles.textInput, { fontSize: inputFontSize }]}
                value={shopName}
                onChangeText={onShopNameChange}
                onBlur={onShopNameBlur}
              />
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Text style={[brandingStyles.label, { fontSize: labelFontSize }]}>
              Logo
            </Text>
            <TouchableOpacity
              style={brandingStyles.uploadButton}
              onPress={onPickLogo}
            >
              <MaterialCommunityIcons name="upload" size={18} color="#000" />
              <Text
                style={[
                  brandingStyles.uploadButtonText,
                  { fontSize: buttonFontSize },
                ]}
                numberOfLines={1}
              >
                {logoBase64 ? "Change Logo" : "Upload Logo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={brandingStyles.gridRow}>
          <View style={brandingStyles.gridItem}>
            <View style={brandingStyles.labelWithIcon}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color="#666"
              />
              <Text style={[brandingStyles.label, { fontSize: labelFontSize }]}>
                Address
              </Text>
            </View>
            <View style={brandingStyles.inputWrapper}>
              <TextInput
                placeholder="Shop address"
                placeholderTextColor="#A3A3A3"
                style={[brandingStyles.textInput, { fontSize: inputFontSize }]}
                value={address}
                onChangeText={(val) => onUpdate({ shopAddress: val })}
              />
            </View>
          </View>
          <View style={brandingStyles.gridItem}>
            <View style={brandingStyles.labelWithIcon}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={14}
                color="#666"
              />
              <Text style={[brandingStyles.label, { fontSize: labelFontSize }]}>
                Phone
              </Text>
            </View>
            <View style={brandingStyles.inputWrapper}>
              <TextInput
                placeholder="9876543210"
                placeholderTextColor="#A3A3A3"
                style={[brandingStyles.textInput, { fontSize: inputFontSize }]}
                value={phone}
                keyboardType="numeric"
                onChangeText={(val) => {
                  // Only allow numbers
                  const filtered = val.replace(/[^0-9]/g, "");
                  onUpdate({ shopPhone: filtered });
                }}
                maxLength={10}
              />
            </View>
          </View>
        </View>

        <View style={brandingStyles.controlRow}>
          <View style={{ flex: 1 }}>
            <Text style={[brandingStyles.label, { fontSize: labelFontSize }]}>
              Brand Alignment
            </Text>
            <View style={brandingStyles.toggleContainer}>
              {(["left", "center", "right"] as const).map((align) => (
                <TouchableOpacity
                  key={align}
                  onPress={() => onUpdate({ brandAlignment: align })}
                  style={[
                    brandingStyles.toggleButton,
                    brandAlignment === align && brandingStyles.activeToggle,
                  ]}
                >
                  <Text
                    style={[
                      brandingStyles.toggleText,
                      { fontSize: isSmallMobile ? 13 : 14 },
                      brandAlignment === align &&
                      brandingStyles.activeToggleText,
                    ]}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {logoBase64 && (
          <View style={brandingStyles.logoPreviewSection}>
            <View style={brandingStyles.logoWrapper}>
              <Image
                source={{ uri: logoBase64 }}
                style={brandingStyles.logoPreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={brandingStyles.deleteBadge}
                onPress={onDeleteLogo}
              >
                <MaterialCommunityIcons name="delete" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={brandingStyles.logoControls}>
              <View style={brandingStyles.sliderSection}>
                <Text
                  style={[brandingStyles.label, { fontSize: labelFontSize }]}
                >
                  Logo Size
                </Text>
                <View style={brandingStyles.sliderWrapper}>
                  <View style={brandingStyles.sliderTrack}>
                    <View
                      style={[
                        brandingStyles.sliderFill,
                        {
                          width:
                            logoSize === 60
                              ? "0%"
                              : logoSize === 80
                                ? "50%"
                                : logoSize === 100
                                  ? "100%"
                                  : "100%",
                        },
                      ]}
                    />
                  </View>
                  <View style={brandingStyles.sliderKnobsRow}>
                    <TouchableOpacity
                      onPress={() => onUpdate({ logoSize: 60 })}
                      style={[
                        brandingStyles.knobContainer,
                        logoSize === 60 && brandingStyles.activeKnobContainer,
                      ]}
                    >
                      <View
                        style={[
                          brandingStyles.sliderKnob,
                          logoSize === 60 && brandingStyles.activeKnob,
                        ]}
                      />
                      <Text
                        style={[
                          brandingStyles.knobLabel,
                          logoSize === 60 && brandingStyles.activeKnobLabel,
                        ]}
                      >
                        Small
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onUpdate({ logoSize: 80 })}
                      style={[
                        brandingStyles.knobContainer,
                        logoSize === 80 && brandingStyles.activeKnobContainer,
                      ]}
                    >
                      <View
                        style={[
                          brandingStyles.sliderKnob,
                          logoSize === 80 && brandingStyles.activeKnob,
                        ]}
                      />
                      <Text
                        style={[
                          brandingStyles.knobLabel,
                          logoSize === 80 && brandingStyles.activeKnobLabel,
                        ]}
                      >
                        Medium
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onUpdate({ logoSize: 100 })}
                      style={[
                        brandingStyles.knobContainer,
                        logoSize === 100 && brandingStyles.activeKnobContainer,
                      ]}
                    >
                      <View
                        style={[
                          brandingStyles.sliderKnob,
                          logoSize === 100 && brandingStyles.activeKnob,
                        ]}
                      />
                      <Text
                        style={[
                          brandingStyles.knobLabel,
                          logoSize === 100 && brandingStyles.activeKnobLabel,
                        ]}
                      >
                        Large
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

interface BrandingPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  shopName: string;
  logoBase64: string | null;
  logoSize: number;
  logoOpacity: number;
  logoPlacement?: "header" | "card";
}

export const BrandingPreviewModal: React.FC<BrandingPreviewModalProps> = ({
  visible,
  onClose,
  shopName,
  logoBase64,
  logoSize,
  logoOpacity,
  logoPlacement,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Branding Preview</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={modalStyles.previewBox}>
            <View style={modalStyles.headerPreview}>
              {logoBase64 && (
                <Image
                  source={{ uri: logoBase64 }}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    opacity: logoOpacity,
                  }}
                  resizeMode="contain"
                />
              )}
              <Text style={modalStyles.previewShopNameHeader}>
                {shopName || "Karatpay"}
              </Text>
            </View>
          </View>

          <Text style={modalStyles.previewHint}>
            This is a scaled-down demo of your actual branding
          </Text>

          <TouchableOpacity style={modalStyles.modalButton} onPress={onClose}>
            <Text style={modalStyles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface NotificationsCardProps {
  config: RateConfig;
  onUpdate: (updates: Partial<RateConfig>) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

interface NotificationItemProps {
  notification: NotificationConfig;
  onToggle: () => void;
  onMessageChange: (text: string) => void;
  labelFontSize?: number;
  inputFontSize?: number;
}

const NotificationItem = memo<NotificationItemProps>(
  ({
    notification,
    onToggle,
    onMessageChange,
    labelFontSize,
    inputFontSize,
  }) => (
    <View style={notificationStyles.notificationBlock}>
      <View style={notificationStyles.notificationHeaderRow}>
        <TouchableOpacity
          style={[
            notificationStyles.switchTrackSmall,
            notification.enabled && notificationStyles.switchTrackOn,
          ]}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <View
            style={[
              notificationStyles.switchThumbSmall,
              notification.enabled && notificationStyles.switchThumbOn,
            ]}
          />
        </TouchableOpacity>
        <Text
          style={[
            notificationStyles.notificationLabel,
            labelFontSize ? { fontSize: labelFontSize } : null,
          ]}
        >
          Notification {notification.id}
        </Text>
      </View>

      <View style={notificationStyles.notificationInputWrapper}>
        <TextInput
          style={[
            notificationStyles.notificationInput,
            inputFontSize ? { fontSize: inputFontSize } : null,
          ]}
          placeholder={`Notification ${notification.id} (e.g., "Special discount today!")`}
          placeholderTextColor="#A3A3A3"
          multiline
          maxLength={100}
          value={notification.message}
          onChangeText={onMessageChange}
        />
        <Text style={notificationStyles.charCount}>
          {notification.message.length}/100
        </Text>
      </View>
    </View>
  )
);

export const NotificationsCard: React.FC<NotificationsCardProps> = ({
  config,
  onUpdate,
  isMobile = false,
  isSmallMobile = false,
}) => {
  const {
    notifications,
    toggleNotificationEnabled,
    updateNotificationMessage,
  } = useRateSetupNotifications(config, onUpdate);

  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 17 : 18;
  const cardSubtitleFontSize = isSmallMobile ? 12 : isMobile ? 13 : 14;
  const labelFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;
  const inputFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;

  return (
    <View style={notificationStyles.card}>
      <View style={notificationStyles.cardHeader}>
        <MaterialCommunityIcons name="bell-outline" size={24} color={GOLD} />
        <Text
          style={[
            notificationStyles.cardTitle,
            { fontSize: cardTitleFontSize },
          ]}
        >
          Notifications (max 3)
        </Text>
      </View>
      <Text
        style={[
          notificationStyles.cardSubtitle,
          { fontSize: cardSubtitleFontSize },
        ]}
      >
        Display announcements to your customers
      </Text>

      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onToggle={() => toggleNotificationEnabled(n.id)}
          onMessageChange={(text) => updateNotificationMessage(n.id, text)}
          labelFontSize={labelFontSize}
          inputFontSize={inputFontSize}
        />
      ))}
    </View>
  );
};

const brandingStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  formContent: {
    gap: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  shopNameRow: {
    flexDirection: "column",
    gap: 12,
    alignItems: "stretch",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textInput: {
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1A1A",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  uploadButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  gridRow: {
    flexDirection: "column",
    gap: 12,
  },
  gridItem: {
    width: "100%",
    gap: 4,
  },
  logoPreviewSection: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    alignItems: "flex-start",
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#EEE",
    padding: 10,
  },
  logoPreview: {
    width: "100%",
    height: "100%",
  },
  deleteBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF5252",
    borderRadius: 10,
    padding: 4,
  },
  logoControls: {
    flex: 1,
    minWidth: 200,
    gap: 16,
  },
  controlRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  controlLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  sliderSection: {
    marginTop: 10,
    width: "100%",
  },
  sliderWrapper: {
    marginTop: 20,
    height: 60,
    justifyContent: "center",
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    position: "absolute",
    left: 20,
    right: 20,
    top: 6,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: GOLD,
    borderRadius: 4,
  },
  sliderKnobsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    zIndex: 2,
  },
  knobContainer: {
    alignItems: "center",
    width: 80,
  },
  activeKnobContainer: {
    // Optional: add any style for active container if needed
  },
  sliderKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  activeKnob: {
    borderColor: GOLD,
    borderWidth: 6,
  },
  knobLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  activeKnobLabel: {
    color: GOLD,
    fontWeight: "700",
  },
  toggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    minWidth: 80,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeToggleText: {
    color: "#000",
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GOLD,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: "#1A1A1A",
  },
  previewBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 40,
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 15,
  },
  headerPreview: {
    alignItems: "center",
    gap: 15,
  },
  previewShopNameHeader: {
    color: "#1A1A1A",
    fontSize: 28,
    fontWeight: "bold",
  },
  previewHint: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});

const notificationStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 20,
  },
  notificationBlock: {
    marginBottom: 16,
  },
  notificationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  switchTrackSmall: {
    width: 38,
    height: 20,
    borderRadius: 12,
    backgroundColor: "#EEEEEE",
    padding: 2,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: GOLD,
  },
  switchThumbSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  switchThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  notificationInputWrapper: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 80,
  },
  notificationInput: {
    color: "#1A1A1A",
    fontSize: 15,
    textAlignVertical: "top",
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  charCount: {
    position: "absolute",
    right: 12,
    bottom: 8,
    fontSize: 11,
    color: "#999",
  },
});
