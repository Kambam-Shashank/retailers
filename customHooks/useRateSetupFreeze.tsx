import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export const useRateSetupFreeze = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const handleToggleFreeze = () => {
    if (!activeConfig.ratesFrozen) {
      const now = new Date().toISOString();
      activeUpdate({ ratesFrozen: true, frozenAt: now });
    } else {
      activeUpdate({ ratesFrozen: false, frozenAt: null });
    }
  };

  const formattedFrozenAt = activeConfig.frozenAt
    ? new Date(activeConfig.frozenAt).toLocaleString()
    : "";

  return {
    ratesFrozen: activeConfig.ratesFrozen,
    frozenAt: activeConfig.frozenAt,
    formattedFrozenAt,
    handleToggleFreeze,
  };
};
