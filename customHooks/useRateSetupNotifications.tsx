import { RateConfig, useRateConfig } from "../contexts/RateConfigContext";

export type NotificationConfig = {
  id: number;
  enabled: boolean;
  message: string;
};

const DEFAULT_NOTIFICATIONS: NotificationConfig[] = [
  { id: 1, enabled: false, message: "" },
  { id: 2, enabled: false, message: "" },
  { id: 3, enabled: false, message: "" },
];

export const useRateSetupNotifications = (
  externalConfig?: RateConfig,
  externalUpdate?: (updates: Partial<RateConfig>) => void
) => {
  const { config, updateConfig } = useRateConfig();
  const activeConfig = externalConfig || config;
  const activeUpdate = externalUpdate || ((u) => updateConfig(u));

  const toggleNotificationEnabled = (id: number) => {
    const updated = activeConfig.notifications.map((n: NotificationConfig) =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    activeUpdate({ notifications: updated });
  };

  const updateNotificationMessage = (id: number, text: string) => {
    if (text.length > 100) return;
    const updated = activeConfig.notifications.map((n: NotificationConfig) =>
      n.id === id ? { ...n, message: text } : n
    );
    activeUpdate({ notifications: updated });
  };

  return {
    notifications: activeConfig.notifications,
    DEFAULT_NOTIFICATIONS,
    toggleNotificationEnabled,
    updateNotificationMessage,
  };
};
