import React from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Branding Preview</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewBox}>
                        {logoPlacement === 'header' && (
                            <View style={styles.headerPreview}>
                                {logoBase64 && (
                                    <Image
                                        source={{ uri: logoBase64 }}
                                        style={{ width: logoSize, height: logoSize }}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={styles.previewShopNameHeader}>{shopName || "Karatpay"}</Text>
                            </View>
                        )}

                        {logoPlacement === 'card' && (
                            <View style={styles.cardPreview}>
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
                                <Text style={styles.previewShopNameCard}>{shopName || "Karatpay"}</Text>
                                <View style={styles.previewContentLine} />
                                <View style={styles.previewContentLine} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.previewHint}>This is a scaled-down demo of your actual branding</Text>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxWidth: 500,
        backgroundColor: "#111",
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: "#333",
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
        color: "#FFF",
    },
    previewBox: {
        backgroundColor: "#000",
        borderRadius: 16,
        padding: 40,
        minHeight: 250,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 15,
    },
    headerPreview: {
        alignItems: "center",
        gap: 15,
    },
    cardPreview: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        padding: 25,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    previewShopNameHeader: {
        color: "#FFF",
        fontSize: 28,
        fontWeight: "bold",
    },
    previewShopNameCard: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
    },
    previewContentLine: {
        width: "100%",
        height: 10,
        backgroundColor: "#222",
        borderRadius: 5,
        marginVertical: 6,
    },
    previewHint: {
        fontSize: 13,
        color: TEXT_MUTED,
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
