import { RateDisplayContent } from "@/components/RateDisplay/RateDisplayContent";
import { WEBSOCKET_URL } from "@/config/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRateConfig } from "../../contexts/RateConfigContext";
import { usePriceChange } from "../../customHooks/usePriceChange";
import { useRateCalculations } from "../../customHooks/useRateCalculations";
import { useAaravRates } from "../../customHooks/useRates";
import useWebSocket, { GoldPriceData } from "../../customHooks/useWebSocket";

const Index = () => {
  const { viewOnly } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { config } = useRateConfig();
  const [withGST, setWithGST] = useState(config.defaultGSTEnabled);
  const [cachedWsData, setCachedWsData] = useState<GoldPriceData | null>(null);

  const { data: aaravRates } = useAaravRates();


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


  const onToggleGST = () => {
    const newGSTState = !withGST;
    setWithGST(newGSTState);
  };

  const getShareUrl = () => {
    let baseUrl = "https://karatpay-retailers.vercel.app";
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.location?.origin
    ) {
      baseUrl = window.location.origin;
    }
    return user ? `${baseUrl}/view/${user.uid}` : baseUrl;
  };

  const shareUrl = getShareUrl();

  const onShare = async (tab?: string) => {
    try {
      const currentUrl = tab === 'designs' ? `${shareUrl}?activeTab=designs` : shareUrl;
      const message = `Namaste,
Greetings from ${config.shopName || 'our shop'}.
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
          alert("Rate link copied to clipboard!");
        }
        return;
      }

      await Share.share({
        message,
        url: currentUrl,
      });
    } catch (error: any) {
      console.error("Share failed:", error?.message || error);
    }
  };

  const isRatesReady = calculatedRates.gold999.basePrice > 0;

  if (!isRatesReady) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: config.backgroundColor || "#fff",
          },
        ]}
      >
        <ActivityIndicator size="large" color={config.priceColor || "#D4AF37"} />
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
        viewOnly={Boolean(viewOnly)}
        withGST={withGST}
        onToggleGST={onToggleGST}
        onShare={onShare}
        onSetupPress={(tab) => {
          if (tab === 'designs') {
            router.push("/setup?tab=catalog");
          } else {
            router.push("/setup");
          }
        }}
        shareUrl={shareUrl}
        gold999Change={gold999Change}
        gold916Change={gold916Change}
        silver999Change={silver999Change}
        silver925Change={silver925Change}
        retailerId={user?.uid}
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
