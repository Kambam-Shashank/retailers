import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export const useRateSetupMargins = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const updateMargin = (key: keyof typeof config, value: number) => {
    const v = Math.round(value);
    activeUpdate({ [key]: v });
  };

  const handleMarginInputChange = (key: string, text: string) => {
    const numeric = parseInt(text.replace(/[^0-9]/g, ""), 10);
    const safe = isNaN(numeric) ? 0 : numeric;
    updateMargin(key as keyof typeof config, safe);
  };

  return {
    gold24kMargin: activeConfig.gold24kMargin,
    gold22kMargin: activeConfig.gold22kMargin,
    gold20kMargin: activeConfig.gold20kMargin,
    gold18kMargin: activeConfig.gold18kMargin,
    gold14kMargin: activeConfig.gold14kMargin,
    silver999Margin: activeConfig.silver999Margin,
    silver925Margin: activeConfig.silver925Margin,
    updateMargin,
    handleMarginInputChange,
  };
};
