import { RateConfig } from "@/contexts/RateConfigContext";
import { useRateSetupFreeze } from "@/customHooks/useRateSetupFreeze";
import { useRateSetupMakingCharges } from "@/customHooks/useRateSetupMakingCharges";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const GOLD = "#D4AF37";

export const commonStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: GOLD,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 4,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: GOLD,
  },
  switchTrack: {
    width: 40,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#E0E0E0",
    padding: 3,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: GOLD,
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F9F9F9",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    color: "#1A1A1A",
    fontSize: 15,
    paddingVertical: 10,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
});

// ====== PurityLabelsCard ======
const DEFAULT_LABELS_MAP: Record<string, string> = {
  gold24k: "24K Gold (999)",
  gold22k: "22K Gold (916)",
  gold20k: "20K Gold (833)",
  gold18k: "18K Gold (750)",
  gold14k: "14K Gold (583)",
  silver999: "Silver (999)",
  silver925: "Silver (925)",
};

interface PurityLabelsProps {
  gold24kLabel: string; gold22kLabel: string; gold20kLabel: string; gold18kLabel: string; gold14kLabel: string; silver999Label: string; silver925Label: string;
  showGold24k: boolean; showGold22k: boolean; showGold20k: boolean; showGold18k: boolean; showGold14k: boolean; showSilver999: boolean; showSilver925: boolean;
  onLabelChange: (key: string, value: string) => void;
  onUpdate: (key: string, value: boolean) => void;
  onLabelsBlur: () => void;
  purityOrder: string[];
  onOrderChange: (newOrder: string[]) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

export const PurityLabelsCard: React.FC<PurityLabelsProps> = ({
  gold24kLabel, gold22kLabel, gold20kLabel, gold18kLabel, gold14kLabel, silver999Label, silver925Label,
  showGold24k, showGold22k, showGold20k, showGold18k, showGold14k, showSilver999, showSilver925,
  onLabelChange, onUpdate, onLabelsBlur, purityOrder, onOrderChange,
  isMobile, isSmallMobile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = purityOrder.map((key) => {
    const labelMap: Record<string, string> = { gold24k: gold24kLabel, gold22k: gold22kLabel, gold20k: gold20kLabel, gold18k: gold18kLabel, gold14k: gold14kLabel, silver999: silver999Label, silver925: silver925Label };
    const visMap: Record<string, boolean> = { gold24k: showGold24k, gold22k: showGold22k, gold20k: showGold20k, gold18k: showGold18k, gold14k: showGold14k, silver999: showSilver999, silver925: showSilver925 };
    const toggleMap: Record<string, string> = { gold24k: "showGold24k", gold22k: "showGold22k", gold20k: "showGold20k", gold18k: "showGold18k", gold14k: "showGold14k", silver999: "showSilver999", silver925: "showSilver925" };
    return { key, label: labelMap[key], visible: visMap[key], toggleKey: toggleMap[key] };
  });
  const handleMove = (index: number, direction: "up" | "down") => {
    const newOrder = [...purityOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      onOrderChange(newOrder);
    }
  };
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>Custom Purity Labels</Text>
      <Text style={commonStyles.cardSubtitle}>Reorder categories and customize labels</Text>
      <View style={{ gap: 12 }}>
        {(isExpanded ? data : data.slice(0, 4)).map((item) => (
          <View key={item.key} style={purityCardStyles.itemContainer}>
            <View style={purityCardStyles.reorderControls}>
              <TouchableOpacity onPress={() => handleMove(data.findIndex(d => d.key === item.key), "up")} disabled={data.findIndex(d => d.key === item.key) === 0} style={{ opacity: data.findIndex(d => d.key === item.key) === 0 ? 0.3 : 1 }}>
                <MaterialCommunityIcons name="chevron-up" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMove(data.findIndex(d => d.key === item.key), "down")} disabled={data.findIndex(d => d.key === item.key) === data.length - 1} style={{ opacity: data.findIndex(d => d.key === item.key) === data.length - 1 ? 0.3 : 1 }}>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <View style={purityCardStyles.row}>
                <Text style={purityCardStyles.labelTitle}>{DEFAULT_LABELS_MAP[item.key]}</Text>
                <TouchableOpacity style={[commonStyles.switchTrack, item.visible && commonStyles.switchTrackOn]} onPress={() => onUpdate(item.toggleKey, !item.visible)}>
                  <View style={[commonStyles.switchThumb, item.visible && commonStyles.switchThumbOn]} />
                </TouchableOpacity>
              </View>
              <TextInput style={[commonStyles.inputWrapper, commonStyles.textInput]} value={item.label} onChangeText={t => onLabelChange(`${item.key}Label`, t)} onBlur={onLabelsBlur} placeholder={DEFAULT_LABELS_MAP[item.key]} />
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={commonStyles.expandButton} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={commonStyles.expandButtonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
        <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={GOLD} />
      </TouchableOpacity>
    </View>
  );
};

// ====== MarginsCard ======
interface MarginsProps {
  gold24kMargin: number; gold22kMargin: number; gold20kMargin: number; gold18kMargin: number; gold14kMargin: number; silver999Margin: number; silver925Margin: number;
  onMarginUpdate: (key: string, value: number) => void;
  onMarginInputChange: (key: string, text: string) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

export const MarginsCard: React.FC<MarginsProps> = ({
  gold24kMargin, gold22kMargin, gold20kMargin, gold18kMargin, gold14kMargin, silver999Margin, silver925Margin,
  onMarginUpdate, onMarginInputChange,
  isMobile, isSmallMobile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const renderField = (label: string, value: number, key: string, unit: string, step: number) => (
    <View style={marginCardStyles.field}>
      <Text style={marginCardStyles.labelTitle}>{label}</Text>
      <View style={marginCardStyles.controlRow}>
        <TouchableOpacity style={marginCardStyles.adjustBtn} onPress={() => onMarginUpdate(key, value - step)}>
          <Text style={marginCardStyles.btnText}>−</Text>
        </TouchableOpacity>
        <View style={marginCardStyles.valueBox}>
          <Text style={marginCardStyles.currency}>₹</Text>
          <TextInput style={marginCardStyles.valText} keyboardType="numeric" value={String(value)} onChangeText={(t) => onMarginInputChange(key, t)} />
        </View>
        <TouchableOpacity style={marginCardStyles.adjustBtn} onPress={() => onMarginUpdate(key, value + step)}>
          <Text style={marginCardStyles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={marginCardStyles.unit}>{unit}</Text>
    </View>
  );
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>Margins</Text>
      <Text style={commonStyles.cardSubtitle}>Set your profit margin for each metal category</Text>
      <View style={{ gap: 16 }}>
        {renderField("24K Gold (999)", gold24kMargin, "gold24kMargin", "per 10g", 50)}
        {renderField("22K Gold (916)", gold22kMargin, "gold22kMargin", "per 10g", 50)}
        {renderField("Silver (999)", silver999Margin, "silver999Margin", "per gram", 10)}
        {renderField("Silver (925)", silver925Margin, "silver925Margin", "per gram", 10)}
        {isExpanded && (
          <>
            {renderField("20K Gold (833)", gold20kMargin, "gold20kMargin", "per 10g", 50)}
            {renderField("18K Gold (750)", gold18kMargin, "gold18kMargin", "per 10g", 50)}
            {renderField("14K Gold (583)", gold14kMargin, "gold14kMargin", "per 10g", 50)}
          </>
        )}
      </View>
      <TouchableOpacity style={commonStyles.expandButton} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={commonStyles.expandButtonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
        <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={GOLD} />
      </TouchableOpacity>
    </View>
  );
};

// ====== MakingChargesCard ======
interface MakingChargesProps {
  config: RateConfig;
  onUpdate: (updates: Partial<RateConfig>) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

export const MakingChargesCard: React.FC<MakingChargesProps> = ({ config: globalConfig, onUpdate, isMobile, isSmallMobile }) => {
  const { makingChargesEnabled, handleToggleMakingCharges, handleChangeMakingType, handleMakingValueChange, handleTitleChange, config } = useRateSetupMakingCharges(globalConfig, onUpdate);
  const renderSection = (key: "24k" | "22k" | "20k" | "18k" | "14k" | "999" | "925", label: string, color: string) => {
    const typeKey = `makingCharges${key}Type` as keyof RateConfig;
    const valueKey = `makingCharges${key}Value` as keyof RateConfig;
    const titleKey = `makingCharges${key}Title` as keyof RateConfig;
    return (
      <View style={makingCardStyles.section}>
        <View style={makingCardStyles.nameRow}>
          <Text style={[makingCardStyles.label, { color }]}>{label}</Text>
          <TextInput style={makingCardStyles.nameInput} value={String(config[titleKey] || '')} onChangeText={(text) => handleTitleChange(key, text)} placeholder="Label (e.g. MC)" />
        </View>
        <View style={makingCardStyles.radioRow}>
          {["percentage", "fixed"].map((type) => (
            <TouchableOpacity key={type} style={makingCardStyles.radioOption} onPress={() => handleChangeMakingType(key, type as any)}>
              <View style={[makingCardStyles.radioOuter, config[typeKey] === type && makingCardStyles.radioActive]}>
                {config[typeKey] === type && <View style={makingCardStyles.radioInner} />}
              </View>
              <Text style={[makingCardStyles.radioLabel, config[typeKey] === type && makingCardStyles.radioLabelActive]}>
                {type === "percentage" ? "Percentage (%)" : "Fixed (₹)"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={makingCardStyles.valRow}>
          <View style={[commonStyles.inputWrapper, { flex: 0.5 }]}>
            <Text style={{ color: GOLD, fontWeight: "600", marginRight: 4 }}>{config[typeKey] === "percentage" ? "%" : "₹"}</Text>
            <TextInput style={commonStyles.textInput} keyboardType="numeric" value={String(config[valueKey] || 0)} onChangeText={(text) => handleMakingValueChange(key, text)} />
          </View>
          <Text style={makingCardStyles.unit}>{config[typeKey] === "percentage" ? "of rate" : key.includes('9') ? "per gram" : "per 10g"}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={commonStyles.card}>
      <View style={makingCardStyles.header}>
        <View>
          <Text style={commonStyles.cardTitle}>Making Charges</Text>
          <Text style={commonStyles.cardSubtitle}>Add making charges to display</Text>
        </View>
        <TouchableOpacity style={[commonStyles.switchTrack, makingChargesEnabled && commonStyles.switchTrackOn]} onPress={handleToggleMakingCharges}>
          <View style={[commonStyles.switchThumb, makingChargesEnabled && commonStyles.switchThumbOn]} />
        </TouchableOpacity>
      </View>
      {makingChargesEnabled && (
        <View style={{ marginTop: 10 }}>
          {renderSection("24k", "24K Gold", GOLD)}
          <View style={makingCardStyles.divider} />
          {renderSection("22k", "22K Gold", GOLD)}
          <View style={makingCardStyles.divider} />
          {renderSection("999", "Silver 999", "#71717A")}
        </View>
      )}
    </View>
  );
};

// ====== RateStatusCard ======
export const RateStatusCard: React.FC<{ config: RateConfig; onUpdate: (u: Partial<RateConfig>) => void; isMobile?: boolean; isSmallMobile?: boolean }> = ({ config, onUpdate, isMobile, isSmallMobile }) => {
  const { ratesFrozen, formattedFrozenAt, handleToggleFreeze } = useRateSetupFreeze(config, onUpdate);
  return (
    <View style={commonStyles.card}>
      <Text style={commonStyles.cardTitle}>Rate Status</Text>
      <Text style={commonStyles.cardSubtitle}>
        {ratesFrozen ? `Rates are frozen${formattedFrozenAt ? ` since ${formattedFrozenAt}` : ""}.` : "Rates are live and updating."}
      </Text>
      <TouchableOpacity style={[statusStyles.btn, ratesFrozen && statusStyles.btnFrozen]} onPress={handleToggleFreeze}>
        <Text style={statusStyles.btnText}>{ratesFrozen ? "Unfreeze Rates" : "Freeze Rates"}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ====== GSTSettingsCard ======
export const GSTSettingsCard: React.FC<{ config: RateConfig; onUpdate: (u: Partial<RateConfig>) => void; isMobile?: boolean; isSmallMobile?: boolean }> = ({ config, onUpdate, isMobile, isSmallMobile }) => (
  <View style={commonStyles.card}>
    <Text style={commonStyles.cardTitle}>GST Display Settings</Text>
    <Text style={commonStyles.cardSubtitle}>Set the default GST toggle state</Text>
    <View style={gstStyles.row}>
      <Text style={gstStyles.label}>Show with GST by default</Text>
      <TouchableOpacity style={[commonStyles.switchTrack, config.defaultGSTEnabled && commonStyles.switchTrackOn]} onPress={() => onUpdate({ defaultGSTEnabled: !config.defaultGSTEnabled })}>
        <View style={[commonStyles.switchThumb, config.defaultGSTEnabled && commonStyles.switchThumbOn]} />
      </TouchableOpacity>
    </View>
  </View>
);

const purityCardStyles = StyleSheet.create({
  itemContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  reorderControls: { flexDirection: "column" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  labelTitle: { fontSize: 13, color: "#666", fontWeight: "600" },
});
const marginCardStyles = StyleSheet.create({
  field: { width: "100%" },
  labelTitle: { fontSize: 13, color: "#666", fontWeight: "600", marginBottom: 8, textTransform: "uppercase" },
  controlRow: { flexDirection: "row", alignItems: "center" },
  adjustBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F9F9F9", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0" },
  btnText: { color: "#1A1A1A", fontSize: 20 },
  valueBox: { flex: 1, marginHorizontal: 12, borderRadius: 12, backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#E0E0E0", paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center" },
  currency: { color: GOLD, fontSize: 16, fontWeight: "600", marginRight: 6 },
  valText: { flex: 1, color: "#1A1A1A", fontSize: 16, fontWeight: "600" },
  unit: { marginTop: 4, fontSize: 11, color: "#64748B", textAlign: "center" },
});
const makingCardStyles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  section: { marginBottom: 20 },
  nameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "600" },
  nameInput: { flex: 1, marginLeft: 15, color: GOLD, fontSize: 14, fontWeight: "600", borderBottomWidth: 1, borderBottomColor: "#E0E0E0", paddingVertical: 4 },
  radioRow: { flexDirection: "row", marginBottom: 14 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#E0E0E0", justifyContent: "center", alignItems: "center", marginRight: 6 },
  radioActive: { borderColor: GOLD },
  radioInner: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: GOLD },
  radioLabel: { fontSize: 13, color: "#666" },
  radioLabelActive: { color: GOLD },
  valRow: { flexDirection: "row", alignItems: "center" },
  unit: { color: "#666", fontSize: 12, marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#EEEEEE", marginVertical: 15 },
});
const statusStyles = StyleSheet.create({
  btn: { backgroundColor: GOLD, paddingVertical: 12, borderRadius: 999, alignItems: "center" },
  btnFrozen: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: GOLD },
  btnText: { color: "#000", fontSize: 14, fontWeight: "600" },
});
const gstStyles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 14, color: "#1A1A1A" },
});
