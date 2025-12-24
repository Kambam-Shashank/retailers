import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";

interface SaveSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>✓</Text>
                    </View>
                    <Text style={styles.modalTitle}>Saved Successfully</Text>
                    <Text style={styles.modalMessage}>
                        Settings updated successfully! Your changes are now live.
                    </Text>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onClose}
                    >
                        <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const GOLD_SOFT = "rgba(212, 175, 55, 0.15)";

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: "#333",
        alignItems: "center",
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: GOLD_SOFT,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: GOLD,
    },
    iconText: {
        fontSize: 30,
        color: GOLD,
        fontWeight: "bold",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: GOLD,
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 15,
        color: "#CCC",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButton: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 8,
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
