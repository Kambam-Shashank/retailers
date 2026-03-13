import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { MakingChargesType, RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export type NotificationConfig = {
    id: number;
    enabled: boolean;
    message: string;
};

export const DEFAULT_LABELS = {
    gold24k: "24K Gold (999)",
    gold22k: "22K Gold (916)",
    gold20k: "20K Gold (833)",
    gold18k: "18K Gold (750)",
    gold14k: "14K Gold (583)",
    silver999: "Silver (999)",
    silver925: "Silver (925)",
};

export const DEFAULT_NOTIFICATIONS: NotificationConfig[] = [
    { id: 1, enabled: false, message: "" },
    { id: 2, enabled: false, message: "" },
    { id: 3, enabled: false, message: "" },
];

export const useRateSetup = (
    externalConfig?: RateConfig,
    externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
    const { config, updateConfig } = useRateConfig();
    const activeConfig = externalConfig || config;
    const activeUpdate = externalUpdate || ((u: Partial<RateConfig>) => updateConfig(u));

    // BRANDING
    const handlePickLogo = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const manipResult = await ImageManipulator.manipulateAsync(
                asset.uri,
                [{ resize: { width: 600 } }],
                {
                    compress: 0.7,
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true,
                }
            );

            if (!manipResult.base64) {
                Alert.alert("Error", "Unable to process image data.");
                return;
            }

            const base64SizeKB = (manipResult.base64.length * 3) / 4 / 1024;
            if (base64SizeKB > 1000) {
                Alert.alert("Too Large", "Image is too large even after compression.");
                return;
            }

            const base = "data:image/jpeg;base64," + manipResult.base64;
            activeUpdate({ logoBase64: base });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const handleDeleteLogo = () => {
        activeUpdate({ logoBase64: null });
    };

    const handleShopNameChange = (text: string) => activeUpdate({ shopName: text });

    // FREEZE
    const handleToggleFreeze = () => {
        if (!activeConfig.ratesFrozen) {
            const now = new Date().toISOString();
            activeUpdate({ ratesFrozen: true, frozenAt: now });
        } else {
            activeUpdate({ ratesFrozen: false, frozenAt: null });
        }
    };

    const formattedFrozenAt = activeConfig.frozenAt
        ? new Date(activeConfig.frozenAt).toLocaleString()
        : "";

    // LABELS
    const updateLabels = (updates: {
        gold24kLabel?: string;
        gold22kLabel?: string;
        gold20kLabel?: string;
        gold18kLabel?: string;
        gold14kLabel?: string;
        silver999Label?: string;
        silver925Label?: string;
    }) => {
        activeUpdate(updates);
    };

    // MAKING CHARGES
    const handleToggleMakingCharges = () => {
        const next = !activeConfig.makingChargesEnabled;
        activeUpdate({ makingChargesEnabled: next });
    };

    const handleChangeMakingType = (
        key: "24k" | "22k" | "20k" | "18k" | "14k" | "999" | "925",
        type: MakingChargesType
    ) => {
        if (key === "24k") activeUpdate({ makingCharges24kType: type });
        else if (key === "22k") activeUpdate({ makingCharges22kType: type });
        else if (key === "20k") activeUpdate({ makingCharges20kType: type });
        else if (key === "18k") activeUpdate({ makingCharges18kType: type });
        else if (key === "14k") activeUpdate({ makingCharges14kType: type });
        else if (key === "999") activeUpdate({ makingCharges999Type: type });
        else if (key === "925") activeUpdate({ makingCharges925Type: type });
    };

    const handleMakingValueChange = (key: "24k" | "22k" | "20k" | "18k" | "14k" | "999" | "925", text: string) => {
        const numeric = parseFloat(text.replace(/[^0-9.]/g, ""));
        const safe = isNaN(numeric) ? 0 : numeric;
        if (key === "24k") activeUpdate({ makingCharges24kValue: safe });
        else if (key === "22k") activeUpdate({ makingCharges22kValue: safe });
        else if (key === "20k") activeUpdate({ makingCharges20kValue: safe });
        else if (key === "18k") activeUpdate({ makingCharges18kValue: safe });
        else if (key === "14k") activeUpdate({ makingCharges14kValue: safe });
        else if (key === "999") activeUpdate({ makingCharges999Value: safe });
        else if (key === "925") activeUpdate({ makingCharges925Value: safe });
    };

    const handleTitleChange = (key: "24k" | "22k" | "20k" | "18k" | "14k" | "999" | "925", text: string) => {
        if (key === "24k") activeUpdate({ makingCharges24kTitle: text });
        else if (key === "22k") activeUpdate({ makingCharges22kTitle: text });
        else if (key === "20k") activeUpdate({ makingCharges20kTitle: text });
        else if (key === "18k") activeUpdate({ makingCharges18kTitle: text });
        else if (key === "14k") activeUpdate({ makingCharges14kTitle: text });
        else if (key === "999") activeUpdate({ makingCharges999Title: text });
        else if (key === "925") activeUpdate({ makingCharges925Title: text });
    };

    // MARGINS
    const updateMargin = (key: keyof RateConfig, value: number) => {
        const v = Math.round(value);
        activeUpdate({ [key]: v });
    };

    const handleMarginInputChange = (key: string, text: string) => {
        const numeric = parseInt(text.replace(/[^0-9]/g, ""), 10);
        const safe = isNaN(numeric) ? 0 : numeric;
        updateMargin(key as keyof RateConfig, safe);
    };

    // NOTIFICATIONS
    const toggleNotificationEnabled = (id: number) => {
        const updated = activeConfig.notifications.map((n: NotificationConfig) =>
            n.id === id ? { ...n, enabled: !n.enabled } : n
        );
        activeUpdate({ notifications: updated });
    };

    const updateNotificationMessage = (id: number, text: string) => {
        if (text.length > 100) return;
        const updated = activeConfig.notifications.map((n: NotificationConfig) =>
            n.id === id ? { ...n, message: text } : n
        );
        activeUpdate({ notifications: updated });
    };

    return {
        config: activeConfig,
        activeConfig,
        activeUpdate,

        // BRANDING
        shopName: activeConfig.shopName,
        logoBase64: activeConfig.logoBase64,
        handlePickLogo,
        handleDeleteLogo,
        handleShopNameChange,

        // FREEZE
        ratesFrozen: activeConfig.ratesFrozen,
        frozenAt: activeConfig.frozenAt,
        formattedFrozenAt,
        handleToggleFreeze,

        // LABELS
        gold24kLabel: activeConfig.gold24kLabel,
        gold22kLabel: activeConfig.gold22kLabel,
        gold20kLabel: activeConfig.gold20kLabel,
        gold18kLabel: activeConfig.gold18kLabel,
        gold14kLabel: activeConfig.gold14kLabel,
        silver999Label: activeConfig.silver999Label,
        silver925Label: activeConfig.silver925Label,
        updateLabels,

        // MAKING CHARGES
        makingChargesEnabled: activeConfig.makingChargesEnabled,
        handleToggleMakingCharges,
        handleChangeMakingType,
        handleMakingValueChange,
        handleTitleChange,

        // MARGINS
        gold24kMargin: activeConfig.gold24kMargin,
        gold22kMargin: activeConfig.gold22kMargin,
        gold20kMargin: activeConfig.gold20kMargin,
        gold18kMargin: activeConfig.gold18kMargin,
        gold14kMargin: activeConfig.gold14kMargin,
        silver999Margin: activeConfig.silver999Margin,
        silver925Margin: activeConfig.silver925Margin,
        updateMargin,
        handleMarginInputChange,

        // NOTIFICATIONS
        notifications: activeConfig.notifications,
        toggleNotificationEnabled,
        updateNotificationMessage,
    };
};
