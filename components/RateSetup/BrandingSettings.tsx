import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RateConfig } from "../../contexts/RateConfigContext";
import { useRateSetupNotifications } from "../../customHooks/useRateSetupNotifications";
import { NotificationConfig } from "../../types/type";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#666666";

// ====== ShopBrandingCard ======
interface ShopBrandingCardProps {
    shopName: string;
    address?: string;
    phone?: string;
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
    address = "",
    phone = "",
    logoBase64,
    logoSize,
    logoPlacement,
    onShopNameChange,
    onShopNameBlur,
    onPickLogo,
    onDeleteLogo,
    onUpdate,
}) => {
    return (
        <View style={brandingStyles.card}>
            <View style={brandingStyles.cardHeader}>
                <MaterialCommunityIcons name="storefront" size={24} color={GOLD} />
                <Text style={brandingStyles.cardTitle}>Shop Branding</Text>
            </View>

            <View style={brandingStyles.formContent}>
                <Text style={brandingStyles.label}>Shop Name *</Text>
                <View style={brandingStyles.shopNameRow}>
                    <View style={brandingStyles.inputWrapper}>
                        <TextInput
                            placeholder="Enter shop name"
                            placeholderTextColor="#A3A3A3"
                            style={brandingStyles.textInput}
                            value={shopName}
                            onChangeText={onShopNameChange}
                            onBlur={onShopNameBlur}
                        />
                    </View>
                    <TouchableOpacity style={brandingStyles.uploadButton} onPress={onPickLogo}>
                        <MaterialCommunityIcons name="upload" size={18} color="#000" />
                        <Text style={brandingStyles.uploadButtonText}>
                            {logoBase64 ? "Change Logo" : "Upload Logo"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={brandingStyles.gridRow}>
                    <View style={brandingStyles.gridItem}>
                        <View style={brandingStyles.labelWithIcon}>
                            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#666" />
                            <Text style={brandingStyles.label}>Address</Text>
                        </View>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput
                                placeholder="Shop address"
                                placeholderTextColor="#A3A3A3"
                                style={brandingStyles.textInput}
                                value={address}
                                onChangeText={(val) => onUpdate({ shopAddress: val })}
                            />
                        </View>
                    </View>
                    <View style={brandingStyles.gridItem}>
                        <View style={brandingStyles.labelWithIcon}>
                            <MaterialCommunityIcons name="phone-outline" size={14} color="#666" />
                            <Text style={brandingStyles.label}>Phone</Text>
                        </View>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput
                                placeholder="+91 98765 43210"
                                placeholderTextColor="#A3A3A3"
                                style={brandingStyles.textInput}
                                value={phone}
                                onChangeText={(val) => onUpdate({ shopPhone: val })}
                            />
                        </View>
                    </View>
                </View>

                {logoBase64 && (
                    <View style={brandingStyles.logoPreviewSection}>
                        <View style={brandingStyles.logoWrapper}>
                            <Image source={{ uri: logoBase64 }} style={brandingStyles.logoPreview} resizeMode="contain" />
                            <TouchableOpacity style={brandingStyles.deleteBadge} onPress={onDeleteLogo}>
                                <MaterialCommunityIcons name="delete" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={brandingStyles.logoControls}>
                            <View style={brandingStyles.controlRow}>
                                <Text style={brandingStyles.controlLabel}>Logo Size</Text>
                                <View style={brandingStyles.sizeOptions}>
                                    {[60, 80, 100, 140].map((size) => (
                                        <TouchableOpacity
                                            key={size}
                                            onPress={() => onUpdate({ logoSize: size })}
                                            style={[brandingStyles.sizeBadge, logoSize === size && brandingStyles.activeBadge]}
                                        >
                                            <Text style={[brandingStyles.badgeText, logoSize === size && brandingStyles.activeBadgeText]}>
                                                {size === 60 ? "S" : size === 80 ? "M" : size === 100 ? "L" : "XL"}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={brandingStyles.controlRow}>
                                <Text style={brandingStyles.controlLabel}>Placement</Text>
                                <View style={brandingStyles.toggleContainer}>
                                    <TouchableOpacity
                                        onPress={() => onUpdate({ logoPlacement: "header" })}
                                        style={[brandingStyles.toggleButton, logoPlacement === "header" && brandingStyles.activeToggle]}
                                    >
                                        <Text style={[brandingStyles.toggleText, logoPlacement === "header" && brandingStyles.activeToggleText]}>Header</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => onUpdate({ logoPlacement: "card" })}
                                        style={[brandingStyles.toggleButton, logoPlacement === "card" && brandingStyles.activeToggle]}
                                    >
                                        <Text style={[brandingStyles.toggleText, logoPlacement === "card" && brandingStyles.activeToggleText]}>Inside Card</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

// ====== BrandingPreviewModal ======
interface BrandingPreviewModalProps {
    visible: boolean;
    onClose: () => void;
    shopName: string;
    logoBase64: string | null;
    logoSize: number;
    logoPlacement: "header" | "card";
    logoOpacity: number;
}

export const BrandingPreviewModal: React.FC<BrandingPreviewModalProps> = ({
    visible,
    onClose,
    shopName,
    logoBase64,
    logoSize,
    logoPlacement,
    logoOpacity,
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
                        {logoPlacement === 'header' && (
                            <View style={modalStyles.headerPreview}>
                                {logoBase64 && (
                                    <Image
                                        source={{ uri: logoBase64 }}
                                        style={{ width: logoSize, height: logoSize }}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={modalStyles.previewShopNameHeader}>{shopName || "Karatpay"}</Text>
                            </View>
                        )}

                        {logoPlacement === 'card' && (
                            <View style={modalStyles.cardPreview}>
                                {logoBase64 && (
                                    <Image
                                        source={{ uri: logoBase64 }}
                                        style={{
                                            width: logoSize * 1.5,
                                            height: logoSize * 1.5,
                                            opacity: logoOpacity,
                                            marginBottom: 10
                                        }}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={modalStyles.previewShopNameCard}>{shopName || "Karatpay"}</Text>
                                <View style={modalStyles.previewContentLine} />
                                <View style={modalStyles.previewContentLine} />
                            </View>
                        )}
                    </View>

                    <Text style={modalStyles.previewHint}>This is a scaled-down demo of your actual branding</Text>

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
}

interface NotificationItemProps {
    notification: NotificationConfig;
    onToggle: () => void;
    onMessageChange: (text: string) => void;
}

const NotificationItem = memo<NotificationItemProps>(
    ({ notification, onToggle, onMessageChange }) => (
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
                <Text style={notificationStyles.notificationLabel}>
                    Notification {notification.id}
                </Text>
            </View>

            <View style={notificationStyles.notificationInputWrapper}>
                <TextInput
                    style={notificationStyles.notificationInput}
                    placeholder={`Notification ${notification.id} (e.g., "Special discount today!")`}
                    placeholderTextColor="#A3A3A3"
                    multiline
                    maxLength={100}
                    value={notification.message}
                    onChangeText={onMessageChange}
                />
                <Text style={notificationStyles.charCount}>{notification.message.length}/100</Text>
            </View>
        </View>
    )
);

export const NotificationsCard: React.FC<NotificationsCardProps> = ({ config, onUpdate }) => {
    const {
        notifications,
        toggleNotificationEnabled,
        updateNotificationMessage,
    } = useRateSetupNotifications(config, onUpdate);

    return (
        <View style={notificationStyles.card}>
            <View style={notificationStyles.cardHeader}>
                <MaterialCommunityIcons name="bell-outline" size={24} color={GOLD} />
                <Text style={notificationStyles.cardTitle}>Notifications (max 3)</Text>
            </View>
            <Text style={notificationStyles.cardSubtitle}>
                Display announcements to your customers
            </Text>

            {notifications.map((n) => (
                <NotificationItem
                    key={n.id}
                    notification={n}
                    onToggle={() => toggleNotificationEnabled(n.id)}
                    onMessageChange={(text) => updateNotificationMessage(n.id, text)}
                />
            ))}
        </View>
    );
};

// ====== Styles ======
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
        fontSize: 14,
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
        marginBottom: 8,
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
            web: { outlineStyle: 'none' } as any
        })
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
        gap: 6,
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    gridRow: {
        flexDirection: "column",
        gap: 12,
    },
    gridItem: {
        flex: 1,
        gap: 4,
    },
    logoPreviewSection: {
        marginTop: 10,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        flexDirection: "row",
        gap: 20,
        alignItems: 'center',
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
        gap: 12,
    },
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    controlLabel: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    sizeOptions: {
        flexDirection: "row",
        gap: 6,
    },
    sizeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#F9F9F9",
    },
    activeBadge: {
        backgroundColor: GOLD,
        borderColor: GOLD,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#666",
    },
    activeBadgeText: {
        color: "#000",
    },
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#F9F9F9",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        overflow: "hidden",
    },
    toggleButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    activeToggle: {
        backgroundColor: GOLD,
    },
    toggleText: {
        fontSize: 11,
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
    cardPreview: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 25,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    previewShopNameHeader: {
        color: "#1A1A1A",
        fontSize: 28,
        fontWeight: "bold",
    },
    previewShopNameCard: {
        color: "#1A1A1A",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    previewContentLine: {
        width: "100%",
        height: 10,
        backgroundColor: "#F0F0F0",
        borderRadius: 5,
        marginVertical: 6,
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
            web: { outlineStyle: 'none' } as any
        })
    },
    charCount: {
        position: "absolute",
        right: 12,
        bottom: 8,
        fontSize: 11,
        color: "#999",
    },
});
