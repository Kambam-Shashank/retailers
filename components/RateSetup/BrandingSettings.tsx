import { useAuth } from "@/contexts/AuthContext";
import { NotificationConfig, RateConfig } from "@/contexts/RateConfigContext";
import { useRateSetupNotifications } from "@/customHooks/useRateSetupNotifications";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { memo, useRef } from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const GOLD = "#D4AF37";

interface ShopBrandingProps {
    shopName: string;
    logoBase64: string | null;
    logoSize: number;
    address?: string;
    phone?: string;
    logoPlacement?: "header" | "card";
    logoOpacity?: number;
    onShopNameChange: (text: string) => void;
    onShopNameBlur: () => void;
    onPickLogo: () => void;
    onDeleteLogo: () => void;
    onUpdate: (updates: Partial<RateConfig>) => void;
    isMobile?: boolean;
    isSmallMobile?: boolean;
}

export const ShopBrandingCard = ({
    shopName, logoBase64, logoSize, address = "", phone = "",
    logoPlacement, logoOpacity,
    onShopNameChange, onShopNameBlur, onPickLogo, onDeleteLogo, onUpdate,
    isMobile, isSmallMobile
}: ShopBrandingProps) => {
    return (
        <View style={brandingStyles.card}>
            <View style={brandingStyles.cardHeader}>
                <MaterialCommunityIcons name="storefront" size={24} color={GOLD} />
                <Text style={brandingStyles.cardTitle}>Shop Branding</Text>
            </View>

            <View style={{ gap: 16 }}>
                <View>
                    <Text style={brandingStyles.label}>Shop Name *</Text>
                    <View style={brandingStyles.inputWrapper}>
                        <TextInput style={brandingStyles.textInput} value={shopName} onChangeText={onShopNameChange} onBlur={onShopNameBlur} placeholder="Enter shop name" />
                    </View>
                </View>

                <View>
                    <Text style={brandingStyles.label}>Logo</Text>
                    <TouchableOpacity style={brandingStyles.uploadBtn} onPress={onPickLogo}>
                        <MaterialCommunityIcons name="upload" size={18} color="#000" />
                        <Text style={brandingStyles.uploadText}>{logoBase64 ? "Change Logo" : "Upload Logo"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={brandingStyles.grid}>
                    <View style={{ flex: 1 }}>
                        <Text style={brandingStyles.label}>Address</Text>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput style={brandingStyles.textInput} value={address} onChangeText={(v) => onUpdate({ shopAddress: v })} placeholder="Address" />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={brandingStyles.label}>Phone</Text>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput style={brandingStyles.textInput} value={phone} keyboardType="numeric" onChangeText={(v) => onUpdate({ shopPhone: v.replace(/[^0-9]/g, "") })} maxLength={10} placeholder="Phone" />
                        </View>
                    </View>
                </View>

                {logoBase64 && (
                    <View style={brandingStyles.logoSection}>
                        <View style={brandingStyles.logoContainer}>
                            <Image source={{ uri: logoBase64 }} style={brandingStyles.logoPreview} resizeMode="contain" />
                            <TouchableOpacity style={brandingStyles.deleteBadge} onPress={onDeleteLogo}>
                                <MaterialCommunityIcons name="delete" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={brandingStyles.label}>Logo Size</Text>
                            <View style={brandingStyles.sizeRow}>
                                {[60, 80, 100].map(s => (
                                    <TouchableOpacity key={s} onPress={() => onUpdate({ logoSize: s })} style={[brandingStyles.sizeBtn, logoSize === s && brandingStyles.sizeBtnActive]}>
                                        <Text style={[brandingStyles.sizeBtnText, logoSize === s && brandingStyles.sizeBtnTextActive]}>{s === 60 ? "S" : s === 80 ? "M" : "L"}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const NotificationItem = memo(({ notification, onToggle, onMsgChange }: { notification: NotificationConfig; onToggle: () => void; onMsgChange: (t: string) => void }) => (
    <View style={notifStyles.item}>
        <View style={notifStyles.header}>
            <TouchableOpacity style={[notifStyles.track, notification.enabled && notifStyles.trackOn]} onPress={onToggle}>
                <View style={[notifStyles.thumb, notification.enabled && notifStyles.thumbOn]} />
            </TouchableOpacity>
            <Text style={notifStyles.notifLabel}>Notification {notification.id}</Text>
        </View>
        <View style={notifStyles.inputBox}>
            <TextInput style={notifStyles.input} placeholder="Announcement text..." multiline maxLength={100} value={notification.message} onChangeText={onMsgChange} />
            <Text style={notifStyles.chars}>{notification.message.length}/100</Text>
        </View>
    </View>
)
);

export const NotificationsCard = ({ config, onUpdate, isMobile, isSmallMobile }: { config: RateConfig; onUpdate: (u: Partial<RateConfig>) => void; isMobile?: boolean; isSmallMobile?: boolean }) => {
    const { notifications, toggleNotificationEnabled, updateNotificationMessage } = useRateSetupNotifications(config, onUpdate);
    return (
        <View style={brandingStyles.card}>
            <View style={brandingStyles.cardHeader}>
                <MaterialCommunityIcons name="bell-outline" size={24} color={GOLD} />
                <Text style={brandingStyles.cardTitle}>Notifications (max 3)</Text>
            </View>
            <Text style={brandingStyles.subtitle}>Display announcements to your customers</Text>
            {notifications.map(n => (
                <NotificationItem key={n.id} notification={n} onToggle={() => toggleNotificationEnabled(n.id)} onMsgChange={(t) => updateNotificationMessage(n.id, t)} />
            ))}
        </View>
    );
};

export const ShareScannerCard = ({ shopName, logoBase64 }: { shopName: string; logoBase64: string | null }) => {
    const { user } = useAuth();
    const qrRef = useRef<any>(null);

    const baseUrl = "https://karatpay-retailers.vercel.app";
    const shareUrl = `${baseUrl}/view/${user?.uid}`;

    const handleShareQR = async () => {
        if (!qrRef.current) return;
        (qrRef.current as any).toDataURL(async (dataURL: string) => {
            const fileName = `Karatpay_QR_${(shopName || "Rates").replace(/\s+/g, '_')}.png`;
            const filePath = `${(FileSystem as any).cacheDirectory}${fileName}`;
            await FileSystem.writeAsStringAsync(filePath, dataURL, {
                encoding: "base64" as any,
            });
            await Sharing.shareAsync(filePath);
        });
    };

    return (
        <View style={brandingStyles.card}>
            <View style={brandingStyles.cardHeader}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color={GOLD} />
                <Text style={brandingStyles.cardTitle}>Share Scanner</Text>
            </View>
            <Text style={brandingStyles.subtitle}>Share your QR code so customers can view live rates</Text>

            <View style={brandingStyles.qrPreviewContainer}>
                <View style={brandingStyles.qrBackground}>
                    <QRCode
                        value={shareUrl}
                        size={150}
                        getRef={(c) => (qrRef.current = c)}
                        logo={logoBase64 ? { uri: logoBase64 } : undefined}
                        logoSize={40}
                        logoBackgroundColor='#FFFFFF'
                        logoMargin={2}
                        ecl="H"
                    />
                </View>

                <TouchableOpacity style={brandingStyles.shareBtn} onPress={handleShareQR}>
                    <Feather name="share-2" size={20} color="#000" />
                    <Text style={brandingStyles.shareBtnText}>Share QR Code</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 0, opacity: 0, overflow: 'hidden', position: 'absolute' }}>
                <QRCode
                    value={shareUrl}
                    size={512} // Higher resolution for sharing
                    logo={logoBase64 ? { uri: logoBase64 } : undefined}
                    logoSize={120}
                    logoBackgroundColor='#FFFFFF'
                    logoMargin={5}
                    ecl="H"
                />
            </View>
        </View>
    );
};

const brandingStyles = StyleSheet.create({
    card: { backgroundColor: "#FFF", borderRadius: 12, marginHorizontal: 16, marginTop: 16, padding: 20, borderWidth: 1, borderColor: "#EEE" },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
    label: { fontSize: 14, fontWeight: "600", color: "#1A1A1A", marginBottom: 8 },
    inputWrapper: { backgroundColor: "#F9F9F9", borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#E0E0E0" },
    textInput: { paddingVertical: 10, fontSize: 15, color: "#1A1A1A", ...Platform.select({ web: { outlineStyle: "none" } as any }) },
    uploadBtn: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
    uploadText: { fontSize: 15, fontWeight: "600" },
    grid: { flexDirection: "row", gap: 12 },
    logoSection: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#EEE", flexDirection: "row", gap: 15, alignItems: "center" },
    logoContainer: { width: 70, height: 70, borderRadius: 8, position: "relative" },
    logoPreview: { width: "100%", height: "100%" },
    deleteBadge: { position: "absolute", top: -5, right: -5, backgroundColor: "#FF5252", borderRadius: 10, padding: 3 },
    sizeRow: { flexDirection: "row", gap: 8 },
    sizeBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "#DDD", alignItems: "center", justifyContent: "center" },
    sizeBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
    sizeBtnText: { fontSize: 12, fontWeight: "600", color: "#666" },
    sizeBtnTextActive: { color: "#000" },
    subtitle: { fontSize: 13, color: "#666", marginBottom: 15 },
    qrPreviewContainer: { alignItems: 'center', gap: 20, marginTop: 10 },
    qrBackground: { padding: 15, backgroundColor: '#F9F9F9', borderRadius: 16, borderWidth: 1, borderColor: '#EEE' },
    shareBtn: { backgroundColor: GOLD, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, width: '100%', shadowColor: GOLD, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    shareBtnText: { fontSize: 16, fontWeight: '700', color: '#000' },
});

const notifStyles = StyleSheet.create({
    item: { marginBottom: 15 },
    header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    track: { width: 34, height: 18, borderRadius: 9, backgroundColor: "#E0E0E0", padding: 2 },
    trackOn: { backgroundColor: GOLD },
    thumb: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#FFF" },
    thumbOn: { marginLeft: 16 },
    notifLabel: { fontSize: 13, fontWeight: "600", color: "#666" },
    inputBox: { backgroundColor: "#F9F9F9", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", padding: 10 },
    input: { minHeight: 60, textAlignVertical: "top", fontSize: 14, color: "#1A1A1A" },
    chars: { fontSize: 10, color: "#999", alignSelf: "flex-end", marginTop: 4 },
});
