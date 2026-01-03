import { db } from "@/Firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

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
  makingCharges24kTitle: string;
  makingCharges22kType: MakingChargesType;
  makingCharges22kValue: number;
  makingCharges22kTitle: string;
  makingCharges999Type: MakingChargesType;
  makingCharges999Value: number;
  makingCharges999Title: string;
  makingCharges925Type: MakingChargesType;
  makingCharges925Value: number;
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
  showDate: boolean;
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

interface RateConfigContextType {
  config: RateConfig;
  updateConfig: (updates: Partial<RateConfig>) => Promise<void>;
  loadConfig: () => Promise<void>;
  resetConfig: () => Promise<void>;
  resetConfigByTab: (tab: "profile" | "rates" | "visual") => Promise<void>;
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
  const { user } = useAuth();

  const loadConfig = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as RateConfig;
        setConfig({ ...getDefaultConfig(), ...data });
      } else {
        // Migration logic: Check local storage
        const localJson = await AsyncStorage.getItem(STORAGE_KEY);
        if (localJson) {
          const localData = JSON.parse(localJson);
          const migratedConfig = { ...getDefaultConfig(), ...localData };

          // Save to Firestore
          await setDoc(userDocRef, migratedConfig);
          setConfig(migratedConfig);

          // Optional: Clear local storage after successful migration
          // await AsyncStorage.removeItem(STORAGE_KEY);
        } else {
          // Initialize new user with default config in Firestore
          await setDoc(userDocRef, getDefaultConfig());
          setConfig(getDefaultConfig());
        }
      }
    } catch (error) {
      console.warn("Failed to load rate config:", error);
    }
  };

  const updateConfig = async (updates: Partial<RateConfig>) => {
    if (!user) return;

    try {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, newConfig, { merge: true });
    } catch (error) {
      console.warn("Failed to update rate config:", error);
    }
  };

  const resetConfig = async () => {
    if (!user) return;

    try {
      const freshConfig = getDefaultConfig();
      setConfig(freshConfig);

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, freshConfig);
    } catch (error) {
      console.warn("Failed to reset rate config:", error);
    }
  };

  const resetConfigByTab = async (tab: string) => {
    if (!user) return;

    try {
      const freshConfig = getDefaultConfig();
      const updates: Partial<RateConfig> = {};

      if (tab === "profile") {
        updates.shopName = freshConfig.shopName;
        updates.shopAddress = freshConfig.shopAddress;
        updates.shopPhone = freshConfig.shopPhone;
        updates.shopEmail = freshConfig.shopEmail;
        updates.logoBase64 = freshConfig.logoBase64;
        updates.logoSize = freshConfig.logoSize;
        updates.logoPlacement = freshConfig.logoPlacement;
        updates.logoOpacity = freshConfig.logoOpacity;
        updates.brandAlignment = freshConfig.brandAlignment;
        updates.notifications = freshConfig.notifications;
      } else if (tab === "rates") {
        updates.gold24kLabel = freshConfig.gold24kLabel;
        updates.gold22kLabel = freshConfig.gold22kLabel;
        updates.silver999Label = freshConfig.silver999Label;
        updates.silver925Label = freshConfig.silver925Label;
        updates.gold24kMargin = freshConfig.gold24kMargin;
        updates.gold22kMargin = freshConfig.gold22kMargin;
        updates.silver999Margin = freshConfig.silver999Margin;
        updates.silver925Margin = freshConfig.silver925Margin;
        updates.makingChargesEnabled = freshConfig.makingChargesEnabled;
        updates.makingCharges24kType = freshConfig.makingCharges24kType;
        updates.makingCharges24kValue = freshConfig.makingCharges24kValue;
        updates.makingCharges24kTitle = freshConfig.makingCharges24kTitle;
        updates.makingCharges22kType = freshConfig.makingCharges22kType;
        updates.makingCharges22kValue = freshConfig.makingCharges22kValue;
        updates.makingCharges22kTitle = freshConfig.makingCharges22kTitle;
        updates.makingCharges999Type = freshConfig.makingCharges999Type;
        updates.makingCharges999Value = freshConfig.makingCharges999Value;
        updates.makingCharges999Title = freshConfig.makingCharges999Title;
        updates.makingCharges925Type = freshConfig.makingCharges925Type;
        updates.makingCharges925Value = freshConfig.makingCharges925Value;
        updates.makingCharges925Title = freshConfig.makingCharges925Title;
        updates.ratesFrozen = freshConfig.ratesFrozen;
        updates.frozenAt = freshConfig.frozenAt;
      } else if (tab === "visual") {
        updates.backgroundColor = freshConfig.backgroundColor;
        updates.textColor = freshConfig.textColor;
        updates.priceColor = freshConfig.priceColor;
        updates.theme = freshConfig.theme;
        updates.layoutDensity = freshConfig.layoutDensity;
        updates.fontTheme = freshConfig.fontTheme;
        updates.cardStyle = freshConfig.cardStyle;
        updates.showTime = freshConfig.showTime;
        updates.showDate = freshConfig.showDate;
        updates.showShopName = freshConfig.showShopName;
        updates.showGold24k = freshConfig.showGold24k;
        updates.showGold22k = freshConfig.showGold22k;
        updates.showSilver999 = freshConfig.showSilver999;
        updates.showSilver925 = freshConfig.showSilver925;
        updates.priceDecimalPlaces = freshConfig.priceDecimalPlaces;
        updates.cardBorderRadius = freshConfig.cardBorderRadius;
        updates.cardBorderWidth = freshConfig.cardBorderWidth;
        updates.cardBorderColor = freshConfig.cardBorderColor;
      }

      await updateConfig(updates);
    } catch (error) {
      console.warn(`Failed to reset ${tab} config:`, error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [user]);

  return (
    <RateConfigContext.Provider
      value={{ config, updateConfig, loadConfig, resetConfig, resetConfigByTab }}
    >
      {children}
    </RateConfigContext.Provider>
  );
};
