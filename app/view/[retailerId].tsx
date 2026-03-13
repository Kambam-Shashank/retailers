import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { WEBSOCKET_URL } from "@/config/api";
import { DEFAULT_CONFIG, RateConfig } from "@/contexts/RateConfigContext";
import { usePriceChange } from "@/customHooks/usePriceChange";
import { useRateCalculations } from "@/customHooks/useRateCalculations";
import { useAaravRates } from "@/customHooks/useRates";
import useWebSocket, { GoldPriceData } from "@/customHooks/useWebSocket";
import { db } from "@/Firebaseconfig";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Share,
    StyleSheet,
    View
} from "react-native";

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
                const rawParam = retailerId ? (Array.isArray(retailerId) ? retailerId.join('/') : retailerId as string) : "";
                const actualRetailerId = rawParam.split(/[:/]/)[0];
                console.log("[SharedRateView] Computed actualRetailerId:", actualRetailerId);

                const docRef = doc(db, "users", actualRetailerId);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...(snapshot.data() as RateConfig) });
                } else {
                    console.warn("Retailer not found:", actualRetailerId);
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

    const params = useLocalSearchParams();
    const { designId: queryDesignId, activeTab: queryActiveTab } = params;

    const rawParam = retailerId ? (Array.isArray(retailerId) ? retailerId.join('/') : retailerId) : "";
    const parts = rawParam.split(/[:/]/);
    const cleanRetailerId = parts[0];
    const pathDesignId = parts.length > 1 ? parts[1] : undefined;

    const finalDesignId = (queryDesignId as string) || pathDesignId;
    const initialTab = (queryActiveTab as 'rates' | 'designs') || (finalDesignId ? 'designs' : 'rates');

    const getShareUrl = () => {
        let baseUrl = "https://karatpay-retailers.vercel.app";
        if (
            Platform.OS === "web" &&
            typeof window !== "undefined" &&
            window.location?.origin
        ) {
            baseUrl = window.location.origin;
        }
        return `${baseUrl}/view/${cleanRetailerId}`;
    };

    const shareUrl = getShareUrl();

    const onShare = async (tab?: string) => {
        try {
            const currentUrl = tab === 'designs' ? `${shareUrl}?activeTab=designs` : shareUrl;
            const message = `Namaste,
Greetings from ${config?.shopName || 'our shop'}.
Kindly open the link below to view today’s Live Gold & Silver rates and browse our latest Jewelry Designs:
${currentUrl}`;

            if (Platform.OS === "web") {
                if (navigator.share) {
                    await navigator.share({
                        title: "Live Gold & Silver Rates",
                        text: message,
                        url: currentUrl,
                    });
                } else {
                    await navigator.clipboard.writeText(currentUrl);
                    alert("Link copied to clipboard!");
                }
                return;
            }

            await Share.share({
                message,
                url: currentUrl,
            });
        } catch (error) {
            console.error("Share failed");
            console.error("[SharedRateView] Share failed:", error);
        }
    };



    if (loading || !config) {
        console.log("[SharedRateView] Loading or config not available. Displaying activity indicator.");
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                </View>
            </>
        );
    }

    console.log("[SharedRateView] Rendering RateDisplayContent with config:", config);
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <RateDisplayContent
                config={config}
                calculatedRates={calculatedRates}
                currentTime={currentTime}
                viewOnly={true}
                withGST={withGST}
                onToggleGST={onToggleGST}
                onShare={onShare}
                shareUrl={shareUrl}
                gold999Change={gold999Change}
                gold916Change={gold916Change}
                silver999Change={silver999Change}
                silver925Change={silver925Change}
                retailerId={cleanRetailerId}
                initialDesignId={finalDesignId}
                initialTab={initialTab}
            />
        </>
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
