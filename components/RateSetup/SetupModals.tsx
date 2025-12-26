import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GOLD = "#D4AF37";
const GOLD_SOFT = "rgba(212, 175, 55, 0.15)";

// ====== ResetConfirmationModal ======
interface ResetConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={modalStyles.modalOverlay}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalTitle}>Reset Defaults</Text>
                    <Text style={modalStyles.modalMessage}>
                        Are you sure you want to reset all configuration to defaults? This cannot be undone.
                    </Text>

                    <View style={modalStyles.modalButtons}>
                        <TouchableOpacity
                            style={[modalStyles.modalButton, modalStyles.modalButtonCancel]}
                            onPress={onClose}
                        >
                            <Text style={modalStyles.modalButtonTextCancel}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[modalStyles.modalButton, modalStyles.modalButtonConfirm]}
                            onPress={onConfirm}
                        >
                            <Text style={modalStyles.modalButtonTextConfirm}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// ====== SaveSuccessModal ======
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
            <View style={modalStyles.modalOverlay}>
                <View style={modalStyles.modalContent}>
                    <View style={modalStyles.iconCircle}>
                        <Text style={modalStyles.iconText}>✓</Text>
                    </View>
                    <Text style={modalStyles.modalTitle}>Saved Successfully</Text>
                    <Text style={modalStyles.modalMessage}>
                        Settings updated successfully! Your changes are now live.
                    </Text>

                    <TouchableOpacity
                        style={modalStyles.saveModalButton}
                        onPress={onClose}
                    >
                        <Text style={modalStyles.saveModalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// ====== Styles ======
const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 24,
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    modalButtonCancel: {
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    modalButtonConfirm: {
        backgroundColor: "#FFEBEE",
        borderWidth: 1,
        borderColor: "#EF5350",
    },
    modalButtonTextCancel: {
        color: "#666",
        fontWeight: "600",
    },
    modalButtonTextConfirm: {
        color: "#D32F2F",
        fontWeight: "600",
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: GOLD_SOFT,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: GOLD,
    },
    iconText: {
        fontSize: 32,
        color: GOLD,
        fontWeight: "bold",
    },
    saveModalButton: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: GOLD,
        alignItems: "center",
        justifyContent: "center",
    },
    saveModalButtonText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 16,
    },
});
