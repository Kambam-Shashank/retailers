import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

const DEFAULT_LABELS = {
  gold24k: "24K Gold (999)",
  gold22k: "22K Gold (916)",
  gold20k: "20K Gold (833)",
  gold18k: "18K Gold (750)",
  gold14k: "14K Gold (583)",
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
    gold20kLabel?: string;
    gold18kLabel?: string;
    gold14kLabel?: string;
    silver999Label?: string;
    silver925Label?: string;
  }) => {
    activeUpdate(updates);
  };

  return {
    gold24kLabel: activeConfig.gold24kLabel,
    gold22kLabel: activeConfig.gold22kLabel,
    gold20kLabel: activeConfig.gold20kLabel,
    gold18kLabel: activeConfig.gold18kLabel,
    gold14kLabel: activeConfig.gold14kLabel,
    silver999Label: activeConfig.silver999Label,
    silver925Label: activeConfig.silver925Label,
    DEFAULT_LABELS,
    updateLabels,
  };
};
