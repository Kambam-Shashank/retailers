import { useMemo } from "react";
import { useRateConfig } from "../contexts/RateConfigContext";
import { GoldPriceData } from "./useWebSocket";


const GST_RATE = 0.03;

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
  gold916: {
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
  externalSilverPrice?: number,
  externalGoldPrice?: number,
  externalSilverIncludesGST?: boolean,
  externalGoldIncludesGST?: boolean
) => {
  const { config } = useRateConfig();

  return useMemo(() => {
    if (!wsData && !externalSilverPrice && !externalGoldPrice) {
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
        gold916: {
          basePrice: 0,
          priceWithMargin: 0,
          priceWithGST: 0,
          finalPrice: 0,
        },
        silver999: { basePrice: 0, priceWithMargin: 0, finalPrice: 0 },
        silver925: { basePrice: 0, priceWithMargin: 0, finalPrice: 0 },
      } as CalculatedRates;
    }
    const gold999Base =
      externalGoldPrice ||
      wsData?.sell_price_999 ||
      wsData?.gold_999 ||
      wsData?.price_999 ||
      0;
    const gold995Base = externalGoldPrice
      ? externalGoldPrice * 0.998
      : wsData?.sell_price_995 ||
      wsData?.gold_995 ||
      wsData?.price_995 ||
      (gold999Base ? gold999Base * 0.998 : 0);
    const gold916FromWS =
      wsData?.gold_916 ||
      wsData?.sell_price_916 ||
      wsData?.price_916;

    const gold916Base = gold916FromWS || (gold999Base * 0.916);

    console.log(
      "Rate calculations - Gold 999 base:",
      gold999Base,
      "Gold 995 base:",
      gold995Base,
      "Gold 916 base:",
      gold916Base
    );
    console.log("WebSocket data:", wsData);
    console.log("External gold price:", externalGoldPrice);

    const silver999Base = externalSilverPrice || 0;
    const silver925Base = externalSilverPrice ? externalSilverPrice * 0.925 : 0;

    const gold999MarginPerGram = config.gold24kMargin;
    const gold995MarginPerGram = config.gold22kMargin;
    const gold916MarginPerGram = config.gold22kMargin;

    const gold999WithMargin = gold999Base + gold999MarginPerGram;
    const gold995WithMargin = gold995Base + gold995MarginPerGram;
    const gold916WithMargin = gold916Base + gold916MarginPerGram;
    const silver999WithMargin = silver999Base + config.silver999Margin;
    const silver925WithMargin = silver925Base + config.silver925Margin;

    const shouldAddGST = withGST && !externalGoldIncludesGST;
    const gold999WithGST = shouldAddGST
      ? gold999WithMargin + gold999WithMargin * GST_RATE
      : gold999WithMargin;
    const gold995WithGST = shouldAddGST
      ? gold995WithMargin + gold995WithMargin * GST_RATE
      : gold995WithMargin;
    const gold916WithGST = shouldAddGST
      ? gold916WithMargin + gold916WithMargin * GST_RATE
      : gold916WithMargin;

    const shouldAddSilverGST = withGST && !externalSilverIncludesGST;
    const silver999WithGST = shouldAddSilverGST
      ? silver999WithMargin + silver999WithMargin * GST_RATE
      : silver999WithMargin;
    const silver925WithGST = shouldAddSilverGST
      ? silver925WithMargin + silver925WithMargin * GST_RATE
      : silver925WithMargin;

    let gold999MakingCharges = 0;
    let gold995MakingCharges = 0;
    let gold916MakingCharges = 0;

    if (config.makingChargesEnabled) {
      if (config.makingChargesType === "percentage") {
        gold999MakingCharges =
          gold999WithGST * (config.makingChargesValue / 100);
        gold995MakingCharges =
          gold995WithGST * (config.makingChargesValue / 100);
        gold916MakingCharges =
          gold916WithGST * (config.makingChargesValue / 100);
      } else {
        gold999MakingCharges = config.makingChargesValue;
        gold995MakingCharges = config.makingChargesValue;
        gold916MakingCharges = config.makingChargesValue;
      }
    }

    const gold999Final = gold999WithGST + gold999MakingCharges;
    const gold995Final = gold995WithGST + gold995MakingCharges;
    const gold916Final = gold916WithGST + gold916MakingCharges;

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
      gold916: {
        basePrice: gold916Base,
        priceWithMargin: gold916WithMargin,
        priceWithGST: gold916WithGST,
        makingCharges: config.makingChargesEnabled
          ? gold916MakingCharges
          : undefined,
        finalPrice: gold916Final,
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
  }, [
    wsData,
    config,
    withGST,
    externalSilverPrice,
    externalGoldPrice,
    externalSilverIncludesGST,
    externalGoldIncludesGST,
  ]);
};
