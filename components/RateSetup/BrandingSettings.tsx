import { useRateSetup } from "@/customHooks/useRateSetup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
    onUpdate: (updates: Partial<any>) => void;
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

            <View style={{ gap: 20 }}>
                <View style={brandingStyles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={brandingStyles.label}>Shop Name *</Text>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput
                                style={brandingStyles.textInput}
                                value={shopName}
                                onChangeText={onShopNameChange}
                                onBlur={onShopNameBlur}
                                placeholder="Enter shop name"
                            />
                        </View>
                    </View>
                    <View style={{ paddingTop: 24 }}>
                        <TouchableOpacity style={brandingStyles.uploadBtn} onPress={onPickLogo}>
                            <MaterialCommunityIcons name="upload" size={18} color="#000" />
                            <Text style={brandingStyles.uploadText}>{logoBase64 ? "Change Logo" : "Upload Logo"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>



                <View style={brandingStyles.grid}>
                    <View style={{ flex: 1.2 }}>
                        <View style={brandingStyles.labelRow}>
                            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
                            <Text style={brandingStyles.labelInline}>Address</Text>
                        </View>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput
                                style={brandingStyles.textInput}
                                value={address}
                                onChangeText={(v) => onUpdate({ shopAddress: v })}
                                placeholder="Shop address"
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={brandingStyles.labelRow}>
                            <MaterialCommunityIcons name="phone-outline" size={16} color="#666" />
                            <Text style={brandingStyles.labelInline}>Phone</Text>
                        </View>
                        <View style={brandingStyles.inputWrapper}>
                            <TextInput
                                style={brandingStyles.textInput}
                                value={phone}
                                keyboardType="numeric"
                                onChangeText={(v) => onUpdate({ shopPhone: v.replace(/[^0-9]/g, "") })}
                                maxLength={12}
                                placeholder="+91 98765 43210"
                            />
                        </View>
                    </View>
                </View>

                <View style={brandingStyles.logoSection}>
                    <View style={brandingStyles.logoContainer}>
                        <Image source={logoBase64 ? { uri: logoBase64 } : require('../../assets/images/karatpay-removebg-preview.png')} style={brandingStyles.logoPreview} resizeMode="contain" />
                        {logoBase64 && (
                            <TouchableOpacity style={brandingStyles.deleteBadge} onPress={onDeleteLogo}>
                                <MaterialCommunityIcons name="delete" size={12} color="#fff" />
                            </TouchableOpacity>
                        )}
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
            </View>
        </View>
    );
};

const NotificationItem = memo(({ notification, onToggle, onMsgChange }: { notification: any; onToggle: () => void; onMsgChange: (t: string) => void }) => (
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

export const NotificationsCard = ({ config, onUpdate, isMobile, isSmallMobile }: { config: any; onUpdate: (u: Partial<any>) => void; isMobile?: boolean; isSmallMobile?: boolean }) => {
    const { notifications, toggleNotificationEnabled, updateNotificationMessage } = useRateSetup(config, onUpdate);
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

const brandingStyles = StyleSheet.create({
    card: { backgroundColor: "#FFF", borderRadius: 16, marginHorizontal: 16, marginTop: 16, padding: 24, borderWidth: 1, borderColor: "#EEE", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
    cardTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
    label: { fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 8 },
    subLabel: { fontSize: 13, fontWeight: "600", color: "#888", marginBottom: 10 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    labelInline: { fontSize: 13, fontWeight: "600", color: "#666" },
    inputWrapper: { backgroundColor: "#F9F9F9", borderRadius: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: "#E8E8E8" },
    textInput: { paddingVertical: 12, fontSize: 16, color: "#1A1A1A", ...Platform.select({ web: { outlineStyle: "none" } as any }) },
    row: { flexDirection: "row", gap: 16, alignItems: 'flex-start' },
    uploadBtn: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minWidth: 140 },
    uploadText: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
    grid: { flexDirection: "row", gap: 16 },
    logoSection: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#EEE", flexDirection: "row", gap: 15, alignItems: "center" },
    logoContainer: { width: 70, height: 70, borderRadius: 8, position: "relative" },
    logoPreview: { width: "100%", height: "100%" },
    deleteBadge: { position: "absolute", top: -5, right: -5, backgroundColor: "#FF5252", borderRadius: 10, padding: 3 },
    sizeRow: { flexDirection: "row", gap: 8 },
    sizeBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "#DDD", alignItems: "center", justifyContent: "center" },
    sizeBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
    sizeBtnText: { fontSize: 12, fontWeight: "600", color: "#666" },
    sizeBtnTextActive: { color: "#000" },
    subtitle: { fontSize: 14, color: "#888", marginBottom: 20 },
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
