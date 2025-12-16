import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

const DEFAULT_LABELS = {
  gold24k: "24K Gold (999)",
  gold22k: "22K Gold (916)",
  silver999: "Silver (999)",
  silver925: "Silver (925)",
};

export const useRateSetupLabels = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const updateLabels = (updates: {
    gold24kLabel?: string;
    gold22kLabel?: string;
    silver999Label?: string;
    silver925Label?: string;
  }) => {
    activeUpdate(updates);
  };

  return {
    gold24kLabel: activeConfig.gold24kLabel,
    gold22kLabel: activeConfig.gold22kLabel,
    silver999Label: activeConfig.silver999Label,
    silver925Label: activeConfig.silver925Label,
    DEFAULT_LABELS,
    updateLabels,
  };
};
