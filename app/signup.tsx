import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const GOLD = "#D4AF37"; // Bright Yellow/Gold

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            await signup(email, password);
            // Navigation is handled in _layout.tsx based on auth state
        } catch (error: any) {
            Alert.alert("Signup Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Get started with Karatpay</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignup}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 20,
    },
    formContainer: {
        maxWidth: 400,
        width: "100%",
        alignSelf: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: GOLD,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },
    button: {
        backgroundColor: GOLD,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        color: "#666",
        fontSize: 14,
    },
    link: {
        color: GOLD,
        fontWeight: "bold",
        fontSize: 14,
    },
});
