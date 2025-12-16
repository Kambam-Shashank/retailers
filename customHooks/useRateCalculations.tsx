import { useMemo } from "react";
import { useRateConfig } from "../contexts/RateConfigContext";
import { GoldPriceData } from "./useWebSocket";

// Gold prices from the WebSocket are per 10 grams.
// We keep all internal values per 10g and only convert to per-gram in the UI.
const GST_RATE = 0.03; // 3% GST

export interface CalculatedRates {
  gold999: {
    basePrice: number;
    priceWithMargin: number;
    priceWithGST: number;
    makingCharges?: number;
    finalPrice: number;
  };
  gold995: {
    basePrice: number;
    priceWithMargin: number;
    priceWithGST: number;
    makingCharges?: number;
    finalPrice: number;
  };
  silver999: {
    basePrice: number;
    priceWithMargin: number;
    finalPrice: number;
  };
  silver925: {
    basePrice: number;
    priceWithMargin: number;
    finalPrice: number;
  };
}

export const useRateCalculations = (
  wsData: GoldPriceData | null,
  withGST: boolean = false,
  externalSilverPrice?: number
) => {
  const { config } = useRateConfig();

  return useMemo(() => {
    // If neither WebSocket data nor external silver price is available,
    // return zeros for all metals.
    if (!wsData && !externalSilverPrice) {
      return {
        gold999: {
          basePrice: 0,
          priceWithMargin: 0,
          priceWithGST: 0,
          finalPrice: 0,
        },
        gold995: {
          basePrice: 0,
          priceWithMargin: 0,
          priceWithGST: 0,
          finalPrice: 0,
        },
        silver999: { basePrice: 0, priceWithMargin: 0, finalPrice: 0 },
        silver925: { basePrice: 0, priceWithMargin: 0, finalPrice: 0 },
      } as CalculatedRates;
    }

    const gold999Base = wsData?.sell_price_999 || 0;
    const gold995Base =
      wsData?.sell_price_995 || (gold999Base ? gold999Base * 0.998 : 0);

    const silver999Base = externalSilverPrice || 0;
    const silver925Base = externalSilverPrice ? externalSilverPrice * 0.925 : 0;

    // Calculate prices with margins
    const gold999MarginPerGram = config.gold24kMargin;
    const gold995MarginPerGram = config.gold22kMargin;

    const gold999WithMargin = gold999Base + gold999MarginPerGram;
    const gold995WithMargin = gold995Base + gold995MarginPerGram;
    const silver999WithMargin = silver999Base + config.silver999Margin;
    const silver925WithMargin = silver925Base + config.silver925Margin;

    // Calculate GST
    const gold999WithGST = withGST
      ? gold999WithMargin + gold999WithMargin * GST_RATE
      : gold999WithMargin;
    const gold995WithGST = withGST
      ? gold995WithMargin + gold995WithMargin * GST_RATE
      : gold995WithMargin;

    // Apply GST to silver as well when enabled
    const silver999WithGST = withGST
      ? silver999WithMargin + silver999WithMargin * GST_RATE
      : silver999WithMargin;
    const silver925WithGST = withGST
      ? silver925WithMargin + silver925WithMargin * GST_RATE
      : silver925WithMargin;

    // Calculate making charges
    let gold999MakingCharges = 0;
    let gold995MakingCharges = 0;

    if (config.makingChargesEnabled) {
      if (config.makingChargesType === "percentage") {
        gold999MakingCharges =
          gold999WithGST * (config.makingChargesValue / 100);
        gold995MakingCharges =
          gold995WithGST * (config.makingChargesValue / 100);
      } else {
        gold999MakingCharges = config.makingChargesValue;
        gold995MakingCharges = config.makingChargesValue;
      }
    }

    const gold999Final = gold999WithGST + gold999MakingCharges;
    const gold995Final = gold995WithGST + gold995MakingCharges;

    return {
      gold999: {
        basePrice: gold999Base,
        priceWithMargin: gold999WithMargin,
        priceWithGST: gold999WithGST,
        makingCharges: config.makingChargesEnabled
          ? gold999MakingCharges
          : undefined,
        finalPrice: gold999Final,
      },
      gold995: {
        basePrice: gold995Base,
        priceWithMargin: gold995WithMargin,
        priceWithGST: gold995WithGST,
        makingCharges: config.makingChargesEnabled
          ? gold995MakingCharges
          : undefined,
        finalPrice: gold995Final,
      },
      silver999: {
        basePrice: silver999Base,
        priceWithMargin: silver999WithMargin,
        finalPrice: silver999WithGST,
      },
      silver925: {
        basePrice: silver925Base,
        priceWithMargin: silver925WithMargin,
        finalPrice: silver925WithGST,
      },
    } as CalculatedRates;
  }, [wsData, config, withGST, externalSilverPrice]);
};
