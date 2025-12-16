import { Alert } from "react-native";
import {
  Asset,
  ImageLibraryOptions,
  launchImageLibrary,
} from "react-native-image-picker";
import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export const useRateSetupBranding = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const handlePickLogo = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: true,
      quality: 0.8,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert("Error", result.errorMessage || "Image picker error");
      return;
    }

    const asset: Asset | undefined = result.assets?.[0];
    if (!asset || !asset.base64) {
      Alert.alert("Error", "Unable to read image data.");
      return;
    }

    const base64SizeKB = (asset.base64.length * 3) / 4 / 1024;
    if (base64SizeKB > 500) {
      Alert.alert("Too Large", "Logo must be less than 500KB.");
      return;
    }

    const base =
      "data:" + (asset.type || "image/jpeg") + ";base64," + asset.base64;
    activeUpdate({ logoBase64: base });
  };

  const handleDeleteLogo = () => {
    activeUpdate({ logoBase64: null });
  };

  return {
    shopName: activeConfig.shopName,
    logoBase64: activeConfig.logoBase64,
    handlePickLogo,
    handleDeleteLogo,
    handleShopNameChange: (text: string) => activeUpdate({ shopName: text }),
  };
};
