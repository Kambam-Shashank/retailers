import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { WEBSOCKET_URL } from "@/config/api";
import { RateConfig } from "@/contexts/RateConfigContext";
import { useAaravRates } from "@/customHooks/useAaravRates";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { useRateCalculations } from "@/customHooks/useRateCalculations";
import useWebSocket, { GoldPriceData } from "@/customHooks/useWebSocket";
import { db } from "@/Firebaseconfig";
import { formatPricePerGram } from "@/utils/formatters";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    View,
} from "react-native";

// Default config fallback
const DEFAULT_CONFIG: RateConfig = {
    shopName: "",
    shopAddress: "",
    shopPhone: "",
    shopEmail: "",
    logoBase64: null,
    gold24kLabel: "24K Gold (999)",
    gold22kLabel: "22K Gold (916)",
    silver999Label: "Silver (999)",
    silver925Label: "Silver (925)",
    gold24kMargin: 0,
    gold22kMargin: 0,
    silver999Margin: 0,
    silver925Margin: 0,
    makingChargesEnabled: false,
    makingCharges24kType: "percentage",
    makingCharges24kValue: 0,
    makingCharges24kTitle: "MC",
    makingCharges22kType: "percentage",
    makingCharges22kValue: 0,
    makingCharges22kTitle: "MC",
    makingCharges999Type: "percentage",
    makingCharges999Value: 0,
    makingCharges999Title: "MC",
    makingCharges925Type: "percentage",
    makingCharges925Value: 0,
    makingCharges925Title: "MC",
    notifications: [],
    ratesFrozen: false,
    frozenAt: null,
    backgroundColor: "#FFFFFF",
    textColor: "#1A1A1A",
    priceColor: "#000000",
    theme: "modern",
    layoutDensity: "normal",
    fontTheme: "modern",
    cardStyle: "boxed",
    showTime: true,
    showDate: true,
    showShopName: true,
    brandAlignment: "center",
    showGold24k: true,
    showGold22k: true,
    showSilver999: true,
    showSilver925: false,
    priceDecimalPlaces: 0,
    cardBorderRadius: 16,
    cardBorderWidth: 1,
    cardBorderColor: "#EEEEEE",
    logoSize: 80,
    logoPlacement: "header",
    logoOpacity: 1,
};

export default function SharedRateView() {
    const { retailerId } = useLocalSearchParams();
    const [config, setConfig] = useState<RateConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [withGST, setWithGST] = useState(true);
    const [cachedWsData, setCachedWsData] = useState<GoldPriceData | null>(null);

    const { data: aaravRates } = useAaravRates();

    useEffect(() => {
        const fetchConfig = async () => {
            if (!retailerId) return;
            try {
                const docRef = doc(db, "users", retailerId as string);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...(snapshot.data() as RateConfig) });
                } else {
                    console.warn("Retailer not found");
                }
            } catch (error) {
                console.error("Error fetching retailer config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, [retailerId]);

    const calculatedRates = useRateCalculations(
        cachedWsData,
        withGST,
        aaravRates.silver,
        undefined,
        aaravRates.silverWithGST,
        true
    );

    const gold999Change = usePriceChange(calculatedRates.gold999.finalPrice);
    const gold916Change = usePriceChange(calculatedRates.gold916.finalPrice);
    const silver999Change = usePriceChange(calculatedRates.silver999.finalPrice);
    const silver925Change = usePriceChange(calculatedRates.silver925.finalPrice);

    const { data: wsData } = useWebSocket(WEBSOCKET_URL);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        if (wsData && (!config || !config.ratesFrozen)) {
            setCachedWsData(wsData);
        }
    }, [wsData, config]);

    useEffect(() => {
        if (wsData && !cachedWsData) {
            setCachedWsData(wsData);
        }
    }, [wsData, cachedWsData]);

    const onToggleGST = () => {
        setWithGST(!withGST);
    };

    const onShare = async () => {
        try {
            let baseUrl = "https://karatpay-retailers.vercel.app";
            if (
                Platform.OS === "web" &&
                typeof window !== "undefined" &&
                window.location?.origin
            ) {
                baseUrl = window.location.origin;
            }

            const shareUrl = `${baseUrl}/view/${retailerId}`;
            const message = `Gold & Silver Live Rates

Gold 999: ${formatPricePerGram(calculatedRates.gold999.finalPrice)}
Silver 999: ${formatPricePerGram(calculatedRates.silver999.finalPrice)}

View live: ${shareUrl}`;

            if (Platform.OS === "web") {
                if (navigator.share) {
                    await navigator.share({
                        title: "Live Gold & Silver Rates",
                        text: message,
                        url: shareUrl,
                    });
                } else {
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                }
                return;
            }

            await Share.share({
                message,
                url: shareUrl,
            });
        } catch (error) {
            console.error("Share failed");
        }
    };

    if (loading || !config) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D4AF37" />
            </View>
        );
    }

    return (
        <ScrollView
            style={[
                styles.container,
                { backgroundColor: config.backgroundColor || "#fff" },
            ]}
        >
            <RateDisplayContent
                config={config}
                calculatedRates={calculatedRates}
                currentTime={currentTime}
                viewOnly={true}
                withGST={withGST}
                onToggleGST={onToggleGST}
                onShare={onShare}
                gold999Change={gold999Change}
                gold916Change={gold916Change}
                silver999Change={silver999Change}
                silver925Change={silver925Change}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
