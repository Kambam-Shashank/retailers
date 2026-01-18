import { RateConfig } from "@/contexts/RateConfigContext";
import { useRateSetupFreeze } from "@/customHooks/useRateSetupFreeze";
import { useRateSetupMakingCharges } from "@/customHooks/useRateSetupMakingCharges";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GOLD = "#D4AF37";
const TEXT_MUTED = "#A1A1A1";

// ====== PurityLabelsCard ======
const DEFAULT_LABELS = {
  gold24k: "24K Gold (999)",
  gold22k: "22K Gold (916)",
  gold20k: "20K Gold (833)",
  gold18k: "18K Gold (750)",
  gold14k: "14K Gold (583)",
  silver999: "Silver (999)",
  silver925: "Silver (925)",
};

interface PurityLabelsCardProps {
  gold24kLabel: string;
  gold22kLabel: string;
  gold20kLabel: string;
  gold18kLabel: string;
  gold14kLabel: string;
  silver999Label: string;
  silver925Label: string;
  showGold24k: boolean;
  showGold22k: boolean;
  showGold20k: boolean;
  showGold18k: boolean;
  showGold14k: boolean;
  showSilver999: boolean;
  showSilver925: boolean;
  isDesktop: boolean;
  isMobile?: boolean;
  isSmallMobile?: boolean;
  onLabelChange: (key: string, value: string) => void;
  onLabelsBlur: () => void;
  onUpdate: (key: string, value: boolean) => void;
  purityOrder: string[];
  onOrderChange: (newOrder: string[]) => void;
}

// Type for purity item data
interface PurityItemData {
  key: string;
  label: string;
  visible: boolean;
  toggleKey: string;
}

export const PurityLabelsCard: React.FC<PurityLabelsCardProps> = ({
  gold24kLabel,
  gold22kLabel,
  gold20kLabel,
  gold18kLabel,
  gold14kLabel,
  silver999Label,
  silver925Label,
  showGold24k,
  showGold22k,
  showGold20k,
  showGold18k,
  showGold14k,
  showSilver999,
  showSilver925,
  isDesktop,
  isMobile = false,
  isSmallMobile = false,
  onLabelChange,
  onUpdate,
  onLabelsBlur,
  purityOrder,
  onOrderChange,
}) => {
  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 18 : 20;
  const cardSubtitleFontSize = isSmallMobile ? 12 : isMobile ? 13 : 14;
  const labelRowTitleFontSize = isSmallMobile ? 12 : 13;
  const textInputFontSize = isSmallMobile ? 13 : isMobile ? 14 : 15;

  const renderToggle = (key: string, value: boolean) => (
    <TouchableOpacity
      style={[
        mcStyles.switchTrack,
        value && mcStyles.switchTrackOn,
        { width: 40, height: 22 },
      ]}
      onPress={() => onUpdate(key, !value)}
      activeOpacity={0.8}
    >
      <View
        style={[
          mcStyles.switchThumb,
          value && mcStyles.switchThumbOn,
          { width: 16, height: 16, borderRadius: 8 },
        ]}
      />
    </TouchableOpacity>
  );

  // Prepare data for draggable list
  const data: PurityItemData[] = purityOrder.map((key) => {
    const getLabelAndToggleKey = (k: string) => {
      const labelMap: Record<string, string> = {
        gold24k: gold24kLabel,
        gold22k: gold22kLabel,
        gold20k: gold20kLabel,
        gold18k: gold18kLabel,
        gold14k: gold14kLabel,
        silver999: silver999Label,
        silver925: silver925Label,
      };
      const visibilityMap: Record<string, boolean> = {
        gold24k: showGold24k,
        gold22k: showGold22k,
        gold20k: showGold20k,
        gold18k: showGold18k,
        gold14k: showGold14k,
        silver999: showSilver999,
        silver925: showSilver925,
      };
      const toggleKeyMap: Record<string, string> = {
        gold24k: "showGold24k",
        gold22k: "showGold22k",
        gold20k: "showGold20k",
        gold18k: "showGold18k",
        gold14k: "showGold14k",
        silver999: "showSilver999",
        silver925: "showSilver925",
      };
      return {
        label: labelMap[k] || "",
        visible: visibilityMap[k] || false,
        toggleKey: toggleKeyMap[k] || "",
      };
    };

    const info = getLabelAndToggleKey(key);
    return {
      key,
      label: info.label,
      visible: info.visible,
      toggleKey: info.toggleKey,
    };
  });

  // Arrow move handler
  const handleMove = (index: number, direction: "up" | "down") => {
    const newOrder = [...purityOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[index],
      ];
      onOrderChange(newOrder);
    }
  };

  return (
    <View style={rateStyles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Text style={[rateStyles.cardTitle, { fontSize: cardTitleFontSize }]}>
          Custom Purity Labels
        </Text>
      </View>
      <Text
        style={[rateStyles.cardSubtitle, { fontSize: cardSubtitleFontSize }]}
      >
        Use arrows to reorder, toggle visibility, and customize labels
      </Text>

      <View style={{ gap: 12 }}>
        {data.map((item, index) => (
          <View key={item.key} style={rateStyles.purityItemContainer}>
            {/* Reorder Arrows */}
            <View style={rateStyles.reorderControls}>
              <TouchableOpacity
                style={[rateStyles.reorderBtn, index === 0 && { opacity: 0.3 }]}
                onPress={() => handleMove(index, "up")}
                disabled={index === 0}
              >
                <View style={rateStyles.arrowUp} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  rateStyles.reorderBtn,
                  index === data.length - 1 && { opacity: 0.3 },
                ]}
                onPress={() => handleMove(index, "down")}
                disabled={index === data.length - 1}
              >
                <View style={rateStyles.arrowDown} />
              </TouchableOpacity>
            </View>

            <View
              style={[rateStyles.purityField, { flex: 1, marginBottom: 0 }]}
            >
              <View style={rateStyles.fieldHeader}>
                <Text
                  style={[
                    rateStyles.labelRowTitle,
                    { fontSize: labelRowTitleFontSize },
                  ]}
                >
                  {DEFAULT_LABELS[item.key as keyof typeof DEFAULT_LABELS]}
                </Text>
                {renderToggle(item.toggleKey, item.visible)}
              </View>
              <View style={rateStyles.inputWrapper}>
                <TextInput
                  placeholder={
                    DEFAULT_LABELS[item.key as keyof typeof DEFAULT_LABELS]
                  }
                  placeholderTextColor="#A3A3A3"
                  style={[
                    rateStyles.textInput,
                    { fontSize: textInputFontSize },
                    { outlineStyle: "none" } as any,
                  ]}
                  value={item.label}
                  onChangeText={(text) =>
                    onLabelChange(`${item.key}Label`, text)
                  }
                  onBlur={onLabelsBlur}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ====== MarginsCard ======
interface MarginsCardProps {
  gold24kMargin: number;
  gold22kMargin: number;
  gold20kMargin: number;
  gold18kMargin: number;
  gold14kMargin: number;
  silver999Margin: number;
  silver925Margin: number;
  isDesktop: boolean;
  isMobile?: boolean;
  isSmallMobile?: boolean;
  onMarginUpdate: (key: string, value: number) => void;
  onMarginInputChange: (key: string, text: string) => void;
}

export const MarginsCard: React.FC<MarginsCardProps> = ({
  gold24kMargin,
  gold22kMargin,
  gold20kMargin,
  gold18kMargin,
  gold14kMargin,
  silver999Margin,
  silver925Margin,
  isDesktop,
  isMobile = false,
  isSmallMobile = false,
  onMarginUpdate,
  onMarginInputChange,
}) => {
  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 18 : 20;
  const cardSubtitleFontSize = isSmallMobile ? 12 : isMobile ? 13 : 14;
  const labelRowTitleFontSize = isSmallMobile ? 12 : 13;
  const valueFontSize = isSmallMobile ? 14 : 16;
  const symbolFontSize = isSmallMobile ? 14 : 16;

  return (
    <View style={marginStyles.card}>
      <Text style={[marginStyles.cardTitle, { fontSize: cardTitleFontSize }]}>
        Margins
      </Text>
      <Text
        style={[marginStyles.cardSubtitle, { fontSize: cardSubtitleFontSize }]}
      >
        Set your profit margin for each metal category
      </Text>
      <View
        style={[marginStyles.marginRow, isDesktop && marginStyles.rowDesktop]}
      >
        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            24K Gold (999)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold24kMargin", gold24kMargin - 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(gold24kMargin)}
                onChangeText={(t) => onMarginInputChange("gold24kMargin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold24kMargin", gold24kMargin + 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per 10g</Text>
        </View>

        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            22K Gold (916)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold22kMargin", gold22kMargin - 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(gold22kMargin)}
                onChangeText={(t) => onMarginInputChange("gold22kMargin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold22kMargin", gold22kMargin + 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per 10g</Text>
        </View>
      </View>

      <View
        style={[marginStyles.marginRow, isDesktop && marginStyles.rowDesktop]}
      >
        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            20K Gold (833)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold20kMargin", gold20kMargin - 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(gold20kMargin)}
                onChangeText={(t) => onMarginInputChange("gold20kMargin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold20kMargin", gold20kMargin + 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per 10g</Text>
        </View>

        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            18K Gold (750)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold18kMargin", gold18kMargin - 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(gold18kMargin)}
                onChangeText={(t) => onMarginInputChange("gold18kMargin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold18kMargin", gold18kMargin + 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per 10g</Text>
        </View>
      </View>

      <View
        style={[marginStyles.marginRow, isDesktop && marginStyles.rowDesktop]}
      >
        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            14K Gold (583)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold14kMargin", gold14kMargin - 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(gold14kMargin)}
                onChangeText={(t) => onMarginInputChange("gold14kMargin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("gold14kMargin", gold14kMargin + 50)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per 10g</Text>
        </View>

        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            Silver (999)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("silver999Margin", silver999Margin - 10)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(silver999Margin)}
                onChangeText={(t) => onMarginInputChange("silver999Margin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("silver999Margin", silver999Margin + 10)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per gram</Text>
        </View>
      </View>

      <View
        style={[marginStyles.marginRow, isDesktop && marginStyles.rowDesktop]}
      >
        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        >
          <Text
            style={[
              marginStyles.labelRowTitle,
              { fontSize: labelRowTitleFontSize },
            ]}
          >
            Silver (925)
          </Text>
          <View style={marginStyles.marginControlRow}>
            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("silver925Margin", silver925Margin - 10)
              }
            >
              <Text style={marginStyles.adjustButtonText}>−</Text>
            </TouchableOpacity>

            <View style={marginStyles.marginValueBox}>
              <Text
                style={[
                  marginStyles.currencySymbol,
                  { fontSize: symbolFontSize },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  marginStyles.marginValueText,
                  { fontSize: valueFontSize },
                  { outlineStyle: "none" } as any,
                ]}
                keyboardType="numeric"
                value={String(silver925Margin)}
                onChangeText={(t) => onMarginInputChange("silver925Margin", t)}
              />
            </View>

            <TouchableOpacity
              style={marginStyles.adjustButton}
              onPress={() =>
                onMarginUpdate("silver925Margin", silver925Margin + 10)
              }
            >
              <Text style={marginStyles.adjustButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={marginStyles.unitText}>per gram</Text>
        </View>
        <View
          style={[
            marginStyles.marginField,
            isDesktop && marginStyles.fieldDesktop,
          ]}
        />
      </View>
    </View>
  );
};

// ====== MakingChargesCard ======
interface MakingChargesCardProps {
  config: RateConfig;
  onUpdate: (updates: Partial<RateConfig>) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

export const MakingChargesCard: React.FC<MakingChargesCardProps> = ({
  config: globalConfig,
  onUpdate,
  isMobile = false,
  isSmallMobile = false,
}) => {
  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 18 : 20;
  const cardSubtitleFontSize = isSmallMobile ? 12 : isMobile ? 13 : 14;
  const labelFontSize = isSmallMobile ? 13 : 14;
  const textInputFontSize = isSmallMobile ? 13 : 14;
  const radioFontSize = isSmallMobile ? 12 : 13;
  const unitFontSize = isSmallMobile ? 11 : 12;

  const {
    makingChargesEnabled,
    handleToggleMakingCharges,
    handleChangeMakingType,
    handleMakingValueChange,
    handleTitleChange,
    config,
  } = useRateSetupMakingCharges(globalConfig, onUpdate);

  const renderPuritySection = (
    key: "24k" | "22k" | "20k" | "18k" | "14k" | "999" | "925",
    label: string,
    color: string
  ) => {
    const typeKey = `makingCharges${key}Type` as keyof RateConfig;
    const valueKey = `makingCharges${key}Value` as keyof RateConfig;
    const titleKey = `makingCharges${key}Title` as keyof RateConfig;

    const currentType = config[typeKey] as string;
    const currentValue = config[valueKey] as number;
    const currentTitle = config[titleKey] as string;

    return (
      <View key={key} style={mcStyles.puritySection}>
        <View style={mcStyles.nameRow}>
          <Text
            style={[
              mcStyles.label,
              {
                color,
                fontWeight: "bold",
                marginBottom: 0,
                fontSize: labelFontSize,
              },
            ]}
          >
            {label}
          </Text>
          <TextInput
            style={[mcStyles.nameInput, { color, fontSize: textInputFontSize }]}
            value={currentTitle}
            onChangeText={(text) => handleTitleChange(key, text)}
            placeholder="Label (e.g. MC)"
            placeholderTextColor="#555"
          />
        </View>

        <View style={mcStyles.radioRow}>
          <TouchableOpacity
            style={mcStyles.radioOption}
            onPress={() => handleChangeMakingType(key, "percentage")}
            activeOpacity={0.8}
          >
            <View
              style={[
                mcStyles.radioOuter,
                currentType === "percentage" && mcStyles.radioOuterActive,
              ]}
            >
              {currentType === "percentage" && (
                <View style={mcStyles.radioInner} />
              )}
            </View>
            <Text
              style={[
                mcStyles.radioLabel,
                { fontSize: radioFontSize },
                currentType === "percentage" && mcStyles.radioLabelActive,
              ]}
            >
              %
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={mcStyles.radioOption}
            onPress={() => handleChangeMakingType(key, "perGram")}
            activeOpacity={0.8}
          >
            <View
              style={[
                mcStyles.radioOuter,
                currentType === "perGram" && mcStyles.radioOuterActive,
              ]}
            >
              {currentType === "perGram" && (
                <View style={mcStyles.radioInner} />
              )}
            </View>
            <Text
              style={[
                mcStyles.radioLabel,
                { fontSize: radioFontSize },
                currentType === "perGram" && mcStyles.radioLabelActive,
              ]}
            >
              /g
            </Text>
          </TouchableOpacity>
        </View>

        <View style={mcStyles.makingValueRow}>
          <View style={[mcStyles.inputWrapper, mcStyles.makingInputWrapper]}>
            <TextInput
              keyboardType="numeric"
              style={[mcStyles.textInput, { fontSize: textInputFontSize }]}
              value={currentValue === 0 ? "" : String(currentValue)}
              onChangeText={(text) => handleMakingValueChange(key, text)}
              placeholder="0"
              placeholderTextColor="#A3A3A3"
            />
          </View>
          <Text style={[mcStyles.makingUnitText, { fontSize: unitFontSize }]}>
            {currentType === "percentage" ? "%" : "/ gram"}
          </Text>
        </View>
        <View style={mcStyles.divider} />
      </View>
    );
  };

  return (
    <View style={mcStyles.card}>
      <Text style={[mcStyles.cardTitle, { fontSize: cardTitleFontSize }]}>
        Making Charges
      </Text>
      <Text style={[mcStyles.cardSubtitle, { fontSize: cardSubtitleFontSize }]}>
        Set individual charges for each metal purity
      </Text>

      <View style={mcStyles.sectionRow}>
        <Text style={[mcStyles.label, { fontSize: labelFontSize }]}>
          Enable Making Charges
        </Text>
        <TouchableOpacity
          style={[
            mcStyles.switchTrack,
            makingChargesEnabled && mcStyles.switchTrackOn,
          ]}
          onPress={handleToggleMakingCharges}
          activeOpacity={0.8}
        >
          <View
            style={[
              mcStyles.switchThumb,
              makingChargesEnabled && mcStyles.switchThumbOn,
            ]}
          />
        </TouchableOpacity>
      </View>

      {makingChargesEnabled && (
        <View style={mcStyles.purityContainer}>
          {renderPuritySection("24k", "24K Gold", GOLD)}
          {renderPuritySection("22k", "22K Gold", GOLD)}
          {renderPuritySection("20k", "20K Gold", GOLD)}
          {renderPuritySection("18k", "18K Gold", GOLD)}
          {renderPuritySection("14k", "14K Gold", GOLD)}
          {renderPuritySection("999", "999 Silver", "#C0C0C0")}
          {renderPuritySection("925", "925 Silver", "#C0C0C0")}
        </View>
      )}
    </View>
  );
};

// ====== RateStatusCard ======
interface RateStatusCardProps {
  config: RateConfig;
  onUpdate: (updates: Partial<RateConfig>) => void;
  isMobile?: boolean;
  isSmallMobile?: boolean;
}

// ====== Styles ======
const rateStyles = StyleSheet.create({
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
  purityRow: {
    flexDirection: "column",
    marginBottom: 8,
  },
  purityField: {
    width: "100%",
    marginBottom: 20,
  },
  rowDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldDesktop: {
    flex: 1,
    width: "auto",
    marginBottom: 0,
    marginRight: 16,
  },
  labelRowTitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F9F9F9",
  },
  textInput: {
    color: "#1A1A1A",
    fontSize: 15,
    paddingVertical: 10,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  purityItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reorderControls: {
    flexDirection: "column",
    gap: 4,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: GOLD,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: GOLD,
  },
  dragHandle: {
    width: 40,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: { cursor: "grab" as any },
    }),
  },
  dragDots: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 2,
  },
  dragDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C0C0C0",
  },
});

export const RateStatusCard: React.FC<RateStatusCardProps> = ({
  config,
  onUpdate,
  isMobile = false,
  isSmallMobile = false,
}) => {
  const cardTitleFontSize = isSmallMobile ? 16 : isMobile ? 18 : 20;
  const cardSubtitleFontSize = isSmallMobile ? 12 : isMobile ? 13 : 14;
  const buttonFontSize = isSmallMobile ? 13 : 14;

  const { ratesFrozen, formattedFrozenAt, handleToggleFreeze } =
    useRateSetupFreeze(config, onUpdate);

  return (
    <View style={statusStyles.card}>
      <Text style={[statusStyles.cardTitle, { fontSize: cardTitleFontSize }]}>
        Rate Status
      </Text>
      <Text
        style={[statusStyles.cardSubtitle, { fontSize: cardSubtitleFontSize }]}
      >
        {ratesFrozen
          ? `Rates are frozen${formattedFrozenAt ? ` since ${formattedFrozenAt}` : ""}.`
          : "Rates are live and updating every 10 seconds."}
      </Text>

      <View style={{ marginTop: 16 }}>
        <TouchableOpacity
          style={[
            statusStyles.freezeButton,
            ratesFrozen ? statusStyles.freezeButtonUnfreeze : null,
          ]}
          onPress={handleToggleFreeze}
        >
          <Text
            style={[
              statusStyles.freezeButtonText,
              { fontSize: buttonFontSize },
            ]}
          >
            {ratesFrozen ? "Unfreeze Rates" : "Freeze Rates"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const marginStyles = StyleSheet.create({
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
  marginRow: {
    flexDirection: "column",
    marginBottom: 8,
  },
  marginField: {
    width: "100%",
    marginBottom: 24,
  },
  rowDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldDesktop: {
    flex: 1,
    width: "auto",
    marginBottom: 0,
    marginRight: 16,
  },
  labelRowTitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  marginControlRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  adjustButtonText: {
    color: "#1A1A1A",
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 22,
  },
  marginValueBox: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  marginValueText: {
    flex: 1,
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 0,
  },
  unitText: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

const mcStyles = StyleSheet.create({
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#E0E0E0",
    padding: 4,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: GOLD,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  switchThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
  },
  radioRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioOuterActive: {
    borderColor: GOLD,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: GOLD,
  },
  radioLabel: {
    fontSize: 13,
    color: "#666",
  },
  radioLabelActive: {
    color: GOLD,
  },
  makingValueRow: {
    flexDirection: "row",
    alignItems: "center",
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
  makingInputWrapper: {
    flex: 0.4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    marginLeft: 15,
    color: GOLD,
    fontSize: 14,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 4,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  textInput: {
    color: "#1A1A1A",
    fontSize: 14,
    paddingVertical: 8,
    ...Platform.select({
      web: { outlineStyle: "none" } as any,
    }),
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 15,
  },
  purityContainer: {
    marginTop: 10,
  },
  puritySection: {
    marginBottom: 20,
  },
  makingUnitText: {
    color: "#666",
    fontSize: 12,
    marginLeft: 5,
  },
});

const statusStyles = StyleSheet.create({
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 18,
  },
  freezeButton: {
    backgroundColor: GOLD,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  freezeButtonUnfreeze: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: GOLD,
  },
  freezeButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
});
