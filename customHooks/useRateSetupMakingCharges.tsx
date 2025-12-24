import { MakingChargesType, RateConfig, useRateConfig } from "../contexts/RateConfigContext";

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

  const handleChangeMakingType = (
    key: "24k" | "22k" | "999" | "925",
    type: MakingChargesType
  ) => {
    if (key === "24k") activeUpdate({ makingCharges24kType: type });
    else if (key === "22k") activeUpdate({ makingCharges22kType: type });
    else if (key === "999") activeUpdate({ makingCharges999Type: type });
    else if (key === "925") activeUpdate({ makingCharges925Type: type });
  };

  const handleMakingValueChange = (key: "24k" | "22k" | "999" | "925", text: string) => {
    const numeric = parseFloat(text.replace(/[^0-9.]/g, ""));
    const safe = isNaN(numeric) ? 0 : numeric;
    if (key === "24k") activeUpdate({ makingCharges24kValue: safe });
    else if (key === "22k") activeUpdate({ makingCharges22kValue: safe });
    else if (key === "999") activeUpdate({ makingCharges999Value: safe });
    else if (key === "925") activeUpdate({ makingCharges925Value: safe });
  };

  const handleTitleChange = (key: "24k" | "22k" | "999" | "925", text: string) => {
    if (key === "24k") activeUpdate({ makingCharges24kTitle: text });
    else if (key === "22k") activeUpdate({ makingCharges22kTitle: text });
    else if (key === "999") activeUpdate({ makingCharges999Title: text });
    else if (key === "925") activeUpdate({ makingCharges925Title: text });
  };

  return {
    makingChargesEnabled: activeConfig.makingChargesEnabled,
    handleToggleMakingCharges,
    handleChangeMakingType,
    handleMakingValueChange,
    handleTitleChange,
    config: activeConfig
  };
};
