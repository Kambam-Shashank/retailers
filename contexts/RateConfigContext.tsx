import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@karatpay_rate_setup";

export type MakingChargesType = "percentage" | "perGram";

export interface NotificationConfig {
  id: number;
  enabled: boolean;
  message: string;
}

export interface RateConfig {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  logoBase64: string | null;
  gold24kLabel: string;
  gold22kLabel: string;
  silver999Label: string;
  silver925Label: string;
  gold24kMargin: number;
  gold22kMargin: number;
  silver999Margin: number;
  silver925Margin: number;
  makingChargesEnabled: boolean;
  makingCharges24kType: MakingChargesType;
  makingCharges24kValue: number;
  makingCharges22kType: MakingChargesType;
  makingCharges22kValue: number;
  makingCharges999Type: MakingChargesType;
  makingCharges999Value: number;
  makingCharges925Type: MakingChargesType;
  makingCharges925Value: number;
  makingCharges24kTitle: string;
  makingCharges22kTitle: string;
  makingCharges999Title: string;
  makingCharges925Title: string;
  notifications: NotificationConfig[];
  ratesFrozen: boolean;
  frozenAt: string | null;
  backgroundColor: string;
  textColor: string;
  priceColor: string;
  // New visual options
  theme: "modern" | "classic" | "dark" | "glass";
  layoutDensity: "compact" | "normal" | "spacious";
  fontTheme: "modern" | "classic" | "serif";
  cardStyle: "boxed" | "minimal";
  showTime: boolean;
  showDate: boolean; // Though date isn't explicitly in UI yet, good to have
  showShopName: boolean;
  brandAlignment: "left" | "center" | "right";
  // Row visibility controls
  showGold24k: boolean;
  showGold22k: boolean;
  showSilver999: boolean;
  showSilver925: boolean;
  // Price formatting
  priceDecimalPlaces: 0 | 1 | 2;
  // Card Styling
  cardBorderRadius: number;
  cardBorderWidth: number;
  cardBorderColor: string;
  // Logo customization
  logoSize: number;
  logoPlacement: "header" | "card";
  logoOpacity: number;
}

interface RateConfigProviderProps {
  children: ReactNode;
}

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
  notifications: [
    { id: 1, enabled: false, message: "" },
    { id: 2, enabled: false, message: "" },
    { id: 3, enabled: false, message: "" },
  ],
  ratesFrozen: false,
  frozenAt: null,
  backgroundColor: "#000000",
  textColor: "#FFFFFF",
  priceColor: "#D4AF37",
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
  cardBorderColor: "#333333",

  logoSize: 80,
  logoPlacement: "header",
  logoOpacity: 1,
};

interface RateConfigContextType {
  config: RateConfig;
  updateConfig: (updates: Partial<RateConfig>) => Promise<void>;
  loadConfig: () => Promise<void>;
  resetConfig: () => Promise<void>;
}

const RateConfigContext = createContext<RateConfigContextType | undefined>(
  undefined
);

export const useRateConfig = () => {
  const context = useContext(RateConfigContext);
  if (!context) {
    throw new Error("useRateConfig must be used within a RateConfigProvider");
  }
  return context;
};

export const RateConfigProvider: React.FC<RateConfigProviderProps> = ({
  children,
}) => {
  const getDefaultConfig = (): RateConfig => JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  const [config, setConfig] = useState<RateConfig>(getDefaultConfig());

  const loadConfig = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const data = JSON.parse(json);
        // Deep merge logic or just overwrite. 
        // Safer to start with default and overlay data
        setConfig({ ...getDefaultConfig(), ...data });
      }
    } catch (error) {
      console.warn("Failed to load rate config:", error);
    }
  };

  const updateConfig = async (updates: Partial<RateConfig>) => {
    try {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.warn("Failed to update rate config:", error);
    }
  };

  const resetConfig = async () => {
    try {
      const freshConfig = getDefaultConfig();
      setConfig(freshConfig);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(freshConfig));
    } catch (error) {
      console.warn("Failed to reset rate config:", error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <RateConfigContext.Provider
      value={{ config, updateConfig, loadConfig, resetConfig }}
    >
      {children}
    </RateConfigContext.Provider>
  );
};
