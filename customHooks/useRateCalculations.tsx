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
    priceWithGST: number;
    makingCharges?: number;
    finalPrice: number;
  };
  silver925: {
    basePrice: number;
    priceWithMargin: number;
    priceWithGST: number;
    makingCharges?: number;
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
          makingCharges: config.makingChargesEnabled ? 0 : undefined,
          finalPrice: 0,
        },
        silver999: { basePrice: 0, priceWithMargin: 0, priceWithGST: 0, makingCharges: config.makingChargesEnabled ? 0 : undefined, finalPrice: 0 },
        silver925: { basePrice: 0, priceWithMargin: 0, priceWithGST: 0, makingCharges: config.makingChargesEnabled ? 0 : undefined, finalPrice: 0 },
      } as CalculatedRates;
    }
    const gold999Base =
      externalGoldPrice ||
      wsData?.gold_999 ||
      wsData?.gold_spot ||
      wsData?.spot ||
      wsData?.bid ||
      wsData?.buy_price_999 ||
      wsData?.price_999 ||
      wsData?.rate_999 ||
      wsData?.sell_price_999 ||
      wsData?.gold ||
      wsData?.rate ||
      wsData?.price ||
      (wsData && wsData["999"]) ||
      0;
    const gold995Base = externalGoldPrice
      ? externalGoldPrice * 0.998
      : wsData?.gold_995 ||
      wsData?.sell_price_995 ||
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

    // Rounding helper
    const roundTo = (num: number, multiple: number) => {
      if (multiple === 0) return num;
      return Math.round(num / multiple) * multiple;
    };

    // Apply specific rounding: Gold -> 50, Silver -> 10
    const gold999WithMargin = roundTo(gold999Base + gold999MarginPerGram, 50);
    const gold995WithMargin = roundTo(gold995Base + gold995MarginPerGram, 50);
    const gold916WithMargin = roundTo(gold916Base + gold916MarginPerGram, 50);
    const silver999WithMargin = roundTo(silver999Base + config.silver999Margin, 10);
    const silver925WithMargin = roundTo(silver925Base + config.silver925Margin, 10);


    const isKaratpayData = !!wsData && (
      "gold_999" in wsData ||
      "sell_price_999" in wsData ||
      "price_999" in wsData ||
      "spot" in wsData
    );
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
    let silver999MakingCharges = 0;
    let silver925MakingCharges = 0;

    if (config.makingChargesEnabled) {
      // 24K
      if (config.makingCharges24kType === "percentage") {
        gold999MakingCharges = gold999WithGST * (config.makingCharges24kValue / 100);
      } else {
        gold999MakingCharges = config.makingCharges24kValue;
      }

      // 22K (916) - We use 22k settings for both 995 and 916 as per existing logic, 
      // but let's see if we should use 22k for both.
      if (config.makingCharges22kType === "percentage") {
        gold995MakingCharges = gold995WithGST * (config.makingCharges22kValue / 100);
        gold916MakingCharges = gold916WithGST * (config.makingCharges22kValue / 100);
      } else {
        gold995MakingCharges = config.makingCharges22kValue;
        gold916MakingCharges = config.makingCharges22kValue;
      }

      // Silver 999
      if (config.makingCharges999Type === "percentage") {
        silver999MakingCharges = silver999WithGST * (config.makingCharges999Value / 100);
      } else {
        silver999MakingCharges = config.makingCharges999Value;
      }

      // Silver 925
      if (config.makingCharges925Type === "percentage") {
        silver925MakingCharges = silver925WithGST * (config.makingCharges925Value / 100);
      } else {
        silver925MakingCharges = config.makingCharges925Value;
      }
    }

    const gold999Final = gold999WithGST + gold999MakingCharges;
    const gold995Final = gold995WithGST + gold995MakingCharges;
    const gold916Final = gold916WithGST + gold916MakingCharges;
    const silver999Final = silver999WithGST + silver999MakingCharges;
    const silver925Final = silver925WithGST + silver925MakingCharges;

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
        priceWithGST: silver999WithGST,
        makingCharges: config.makingChargesEnabled
          ? silver999MakingCharges
          : undefined,
        finalPrice: silver999Final,
      },
      silver925: {
        basePrice: silver925Base,
        priceWithMargin: silver925WithMargin,
        priceWithGST: silver925WithGST,
        makingCharges: config.makingChargesEnabled
          ? silver925MakingCharges
          : undefined,
        finalPrice: silver925Final,
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
