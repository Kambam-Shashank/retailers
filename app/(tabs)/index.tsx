import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { WEBSOCKET_URL } from "@/config/api";
import { formatPricePerGram } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Share, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRateConfig } from "../../contexts/RateConfigContext";
import { useAaravRates } from "../../customHooks/useAaravRates";
import { usePriceChange } from "../../customHooks/usePriceChange";
import { useRateCalculations } from "../../customHooks/useRateCalculations";
import useWebSocket, { GoldPriceData } from "../../customHooks/useWebSocket";

const Index = () => {
  const { viewOnly } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [withGST, setWithGST] = useState(true);
  const [cachedWsData, setCachedWsData] = useState<GoldPriceData | null>(null);

  const { config } = useRateConfig();
  const { data: aaravRates } = useAaravRates();

  // Console log Aarav API data
  useEffect(() => {
    console.log("=== AARAV API DATA ===>", {
      silver: aaravRates.silver,
      gold: aaravRates.gold,
      silverWithGST: aaravRates.silverWithGST,
      goldWithGST: aaravRates.goldWithGST,
    });
  }, [aaravRates]);

  const calculatedRates = useRateCalculations(
    cachedWsData,
    withGST,
    aaravRates.silver,
    undefined,
    aaravRates.silverWithGST,
    true
  );

  // Track price changes for all metals
  const gold999Change = usePriceChange(calculatedRates.gold999.finalPrice);
  const gold916Change = usePriceChange(calculatedRates.gold916.finalPrice);
  const silver999Change = usePriceChange(calculatedRates.silver999.finalPrice);
  const silver925Change = usePriceChange(calculatedRates.silver925.finalPrice);

  const {
    data: wsData,
    isConnected,
    error,
    sendMessage,
  } = useWebSocket(WEBSOCKET_URL);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (wsData && !config.ratesFrozen) {
      setCachedWsData(wsData);
    }
  }, [wsData, config.ratesFrozen]);

  useEffect(() => {
    if (wsData && !cachedWsData) {
      setCachedWsData(wsData);
    }
  }, [wsData, cachedWsData]);

  // Console log calculated rates when they change
  useEffect(() => {
    console.log("=== CALCULATED RATES ===> ", {
      withGST,
      gold999: calculatedRates.gold999,
      gold916: calculatedRates.gold916,
      silver999: calculatedRates.silver999,
      silver925: calculatedRates.silver925,
    });
  }, [calculatedRates, withGST]);

  const onToggleGST = () => {
    const newGSTState = !withGST;
    console.log("=== GST TOGGLE PRESSED ===> ", {
      previousState: withGST,
      newState: newGSTState,
    });
    setWithGST(newGSTState);
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

      // Generate the public view URL using the user's UID
      const shareUrl = user ? `${baseUrl}/view/${user.uid}` : baseUrl;

      const message = `Gold & Silver Live Rates

Gold 999 (per gram): ${formatPricePerGram(
        calculatedRates.gold999.finalPrice
      )}
Silver 999 (per gram): ${formatPricePerGram(
        calculatedRates.silver999.finalPrice
      )}

View live rates here:
${shareUrl}`;

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Live Gold & Silver Rates",
            text: message,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert("Rate link copied to clipboard!");
        }
        return;
      }

      await Share.share({
        message,
        url: shareUrl,
      });
    } catch (error: any) {
      console.error("Share failed:", error?.message || error);
    }
  };

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
        viewOnly={Boolean(viewOnly)}
        withGST={withGST}
        onToggleGST={onToggleGST}
        onShare={onShare}
        onSetupPress={() => router.push("/setup")}
        gold999Change={gold999Change}
        gold916Change={gold916Change}
        silver999Change={silver999Change}
        silver925Change={silver925Change}

      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Index;
