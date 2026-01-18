import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export const useRateSetupBranding = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const handlePickLogo = async () => {
    try {
      // 1. Pick Image (No native editing, No initial base64)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Fixes "missing checkmark" on some Androids
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // 2. Resize & Compress
      const manipResult = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 600 } }], // Resize to reasonable width for logo
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

  return {
    shopName: activeConfig.shopName,
    logoBase64: activeConfig.logoBase64,
    handlePickLogo,
    handleDeleteLogo,
    handleShopNameChange: (text: string) => activeUpdate({ shopName: text }),
  };
};
