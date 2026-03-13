import React from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";

// ====== ResetConfirmationModal ======
export const ResetConfirmationModal: React.FC<{ visible: boolean; onClose: () => void; onConfirm: () => void; tabName: string }> = ({
    visible, onClose, onConfirm, tabName
}) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={modalStyles.overlay}>
            <View style={modalStyles.content}>
                <Text style={modalStyles.title}>Reset {tabName}?</Text>
                <Text style={modalStyles.message}>This will revert all changes in this tab to default values. This action cannot be undone.</Text>
                <View style={modalStyles.btnRow}>
                    <TouchableOpacity style={[modalStyles.btn, modalStyles.btnSecondary]} onPress={onClose}>
                        <Text style={modalStyles.btnTextSecondary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[modalStyles.btn, modalStyles.btnDanger]} onPress={onConfirm}>
                        <Text style={modalStyles.btnTextPrimary}>Reset Tab</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// ====== SaveSuccessModal ======
export const SaveSuccessModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={modalStyles.overlay}>
            <View style={modalStyles.content}>
                <View style={modalStyles.iconCircle}>
                    <Text style={{ fontSize: 32 }}>✅</Text>
                </View>
                <Text style={modalStyles.title}>Settings Saved</Text>
                <Text style={modalStyles.message}>Your changes have been successfully saved and updated.</Text>
                <TouchableOpacity style={[modalStyles.btn, modalStyles.btnPrimary, { width: '100%' }]} onPress={onClose}>
                    <Text style={modalStyles.btnTextPrimary}>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

// ====== BrandingPreviewModal ======
export const BrandingPreviewModal: React.FC<{
    visible: boolean; onClose: () => void; shopName: string; logoBase64: string | null; logoSize: number
}> = ({ visible, onClose, shopName, logoBase64, logoSize }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={modalStyles.overlay}>
            <View style={[modalStyles.content, { maxWidth: 500 }]}>
                <View style={modalStyles.modalHeader}>
                    <Text style={modalStyles.title}>Branding Preview</Text>
                    <TouchableOpacity onPress={onClose}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
                </View>
                <View style={modalStyles.previewBox}>
                    {logoBase64 && (
                        <Image source={{ uri: logoBase64 }} style={{ width: logoSize, height: logoSize }} resizeMode="contain" />
                    )}
                    <Text style={modalStyles.previewShopName}>{shopName || "Karatpay"}</Text>
                </View>
                <Text style={modalStyles.hint}>This is a scaled-down demo of your branding</Text>
                <TouchableOpacity style={[modalStyles.btn, modalStyles.btnPrimary, { width: '100%' }]} onPress={onClose}>
                    <Text style={modalStyles.btnTextPrimary}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const modalStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
    content: { backgroundColor: "#FFF", borderRadius: 20, padding: 24, width: "100%", alignItems: "center", elevation: 5 },
    title: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
    message: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24, lineHeight: 20 },
    btnRow: { flexDirection: "row", gap: 12, width: "100%" },
    btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    btnPrimary: { backgroundColor: GOLD },
    btnSecondary: { backgroundColor: "#F5F5F5" },
    btnDanger: { backgroundColor: "#FEE2E2" },
    btnTextPrimary: { fontSize: 16, fontWeight: "700", color: "#000" },
    btnTextSecondary: { fontSize: 16, fontWeight: "600", color: "#666" },
    iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center", marginBottom: 16 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: 20 },
    previewBox: { backgroundColor: "#F5F5F5", borderRadius: 16, padding: 40, width: "100%", minHeight: 200, alignItems: "center", justifyContent: "center", marginBottom: 15 },
    previewShopName: { fontSize: 24, fontWeight: "bold", marginTop: 15 },
    hint: { fontSize: 12, color: "#666", fontStyle: "italic", marginBottom: 20 },
});
