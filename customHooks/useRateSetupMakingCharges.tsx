import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export type MakingChargesType = "percentage" | "perGram";

export const useRateSetupMakingCharges = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const handleToggleMakingCharges = () => {
    const next = !activeConfig.makingChargesEnabled;
    activeUpdate({ makingChargesEnabled: next });
  };

  const handleChangeMakingType = (type: MakingChargesType) => {
    activeUpdate({ makingChargesType: type });
  };

  const handleMakingValueChange = (text: string) => {
    const numeric = parseFloat(text.replace(/[^0-9.]/g, ""));
    const safe = isNaN(numeric) ? 0 : numeric;
    activeUpdate({ makingChargesValue: safe });
  };

  return {
    makingChargesEnabled: activeConfig.makingChargesEnabled,
    makingChargesType: activeConfig.makingChargesType,
    makingChargesValue: activeConfig.makingChargesValue,
    handleToggleMakingCharges,
    handleChangeMakingType,
    handleMakingValueChange,
  };
};
