import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

interface ShopDetailsCardProps {
    address: string;
    phone: string;
    email: string;
    onUpdate: (updates: Partial<any>) => void;
}

export const ShopDetailsCard: React.FC<ShopDetailsCardProps> = ({
    address,
    phone,
    email,
    onUpdate,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Shop Details</Text>
            <Text style={styles.cardSubtitle}>
                Add contact information for the footer display
            </Text>

            <View style={styles.section}>
                <Text style={styles.label}>Shop Address</Text>
                <View style={[styles.inputWrapper, { height: 80 }]}>
                    <TextInput
                        multiline
                        placeholder="Enter full address"
                        placeholderTextColor="#555"
                        style={styles.textInput}
                        value={address}
                        onChangeText={(text) => onUpdate({ shopAddress: text })}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Phone Number(s)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="e.g. 022-61837523, 022-61838989"
                        placeholderTextColor="#555"
                        style={styles.textInput}
                        value={phone}
                        onChangeText={(text) => onUpdate({ shopPhone: text })}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder="e.g. info@shopname.com"
                        placeholderTextColor="#555"
                        style={styles.textInput}
                        value={email}
                        onChangeText={(text) => onUpdate({ shopEmail: text })}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#0F0F0F",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.15)",
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: GOLD,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        color: TEXT_MUTED,
        fontWeight: "600",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: "#161616",
    },
    textInput: {
        color: "#fff",
        fontSize: 15,
        paddingVertical: 12,
        textAlignVertical: "top",
    },
});
