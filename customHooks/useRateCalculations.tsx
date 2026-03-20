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
  gold20k: {
    basePrice: number;
    priceWithMargin: number;
    priceWithGST: number;
    makingCharges?: number;
    finalPrice: number;
  };
  gold18k: {
    basePrice: number;
    priceWithMargin: number;
    priceWithGST: number;
    makingCharges?: number;
    finalPrice: number;
  };
  gold14k: {
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
        gold20k: { basePrice: 0, priceWithMargin: 0, priceWithGST: 0, makingCharges: config.makingChargesEnabled ? 0 : undefined, finalPrice: 0 },
        gold18k: { basePrice: 0, priceWithMargin: 0, priceWithGST: 0, makingCharges: config.makingChargesEnabled ? 0 : undefined, finalPrice: 0 },
        gold14k: { basePrice: 0, priceWithMargin: 0, priceWithGST: 0, makingCharges: config.makingChargesEnabled ? 0 : undefined, finalPrice: 0 },
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
    const gold20kBase = gold916FromWS ? (gold916FromWS / 0.916) * 0.833 : gold999Base * 0.833;
    const gold18kBase = gold916FromWS ? (gold916FromWS / 0.916) * 0.750 : gold999Base * 0.750;
    const gold14kBase = gold916FromWS ? (gold916FromWS / 0.916) * 0.585 : gold999Base * 0.585;


    const silver999Base = externalSilverPrice || 0;
    const silver925Base = externalSilverPrice ? externalSilverPrice * 0.925 : 0;

    const gold999MarginScaled = config.gold24kMargin * 10;
    const gold995MarginScaled = config.gold22kMargin * 10;
    const gold916MarginScaled = config.gold22kMargin * 10;
    const gold20kMarginScaled = config.gold20kMargin * 10;
    const gold18kMarginScaled = config.gold18kMargin * 10;
    const gold14kMarginScaled = config.gold14kMargin * 10;
    const silver999MarginScaled = config.silver999Margin * 10;
    const silver925MarginScaled = config.silver925Margin * 10;

    // Apply exact calculation (No Rounding)
    const gold999WithMargin = gold999Base + gold999MarginScaled;
    const gold995WithMargin = gold995Base + gold995MarginScaled;
    const gold916WithMargin = gold916Base + gold916MarginScaled;
    const gold20kWithMargin = gold20kBase + gold20kMarginScaled;
    const gold18kWithMargin = gold18kBase + gold18kMarginScaled;
    const gold14kWithMargin = gold14kBase + gold14kMarginScaled;
    const silver999WithMargin = silver999Base + silver999MarginScaled;
    const silver925WithMargin = silver925Base + silver925MarginScaled;


    const isKaratpayData = !!wsData && (
      "gold_999" in wsData ||
      "sell_price_999" in wsData ||
      "price_999" in wsData ||
      "spot" in wsData
    );
    const calculateFinalGSTPrice = (price: number, sourceIncludesGST: boolean | undefined) => {
      if (withGST) {
        return sourceIncludesGST ? price : price + price * GST_RATE;
      } else {
        return sourceIncludesGST ? price / (1 + GST_RATE) : price;
      }
    };

    const gold999WithGST = calculateFinalGSTPrice(gold999WithMargin, externalGoldIncludesGST);
    const gold995WithGST = calculateFinalGSTPrice(gold995WithMargin, externalGoldIncludesGST);
    const gold916WithGST = calculateFinalGSTPrice(gold916WithMargin, externalGoldIncludesGST);
    const gold20kWithGST = calculateFinalGSTPrice(gold20kWithMargin, externalGoldIncludesGST);
    const gold18kWithGST = calculateFinalGSTPrice(gold18kWithMargin, externalGoldIncludesGST);
    const gold14kWithGST = calculateFinalGSTPrice(gold14kWithMargin, externalGoldIncludesGST);

    const silver999WithGST = calculateFinalGSTPrice(silver999WithMargin, externalSilverIncludesGST);
    const silver925WithGST = calculateFinalGSTPrice(silver925WithMargin, externalSilverIncludesGST);

    let gold999MakingCharges = 0;
    let gold995MakingCharges = 0;
    let gold916MakingCharges = 0;
    let gold20kMakingCharges = 0;
    let gold18kMakingCharges = 0;
    let gold14kMakingCharges = 0;
    let silver999MakingCharges = 0;
    let silver925MakingCharges = 0;

    if (config.makingChargesEnabled) {
      if (config.makingCharges24kType === "percentage") {
        gold999MakingCharges = gold999WithGST * (config.makingCharges24kValue / 100);
      } else {
        gold999MakingCharges = config.makingCharges24kValue * 10;
      }


      if (config.makingCharges22kType === "percentage") {
        gold995MakingCharges = gold995WithGST * (config.makingCharges22kValue / 100);
        gold916MakingCharges = gold916WithGST * (config.makingCharges22kValue / 100);
      } else {
        gold995MakingCharges = config.makingCharges22kValue * 10;
        gold916MakingCharges = config.makingCharges22kValue * 10;
      }

      if (config.makingCharges20kType === "percentage") {
        gold20kMakingCharges = gold20kWithGST * (config.makingCharges20kValue / 100);
      } else {
        gold20kMakingCharges = config.makingCharges20kValue * 10;
      }

      if (config.makingCharges18kType === "percentage") {
        gold18kMakingCharges = gold18kWithGST * (config.makingCharges18kValue / 100);
      } else {
        gold18kMakingCharges = config.makingCharges18kValue * 10;
      }

      if (config.makingCharges14kType === "percentage") {
        gold14kMakingCharges = gold14kWithGST * (config.makingCharges14kValue / 100);
      } else {
        gold14kMakingCharges = config.makingCharges14kValue * 10;
      }

      if (config.makingCharges999Type === "percentage") {
        silver999MakingCharges = silver999WithGST * (config.makingCharges999Value / 100);
      } else {
        silver999MakingCharges = config.makingCharges999Value * 10;
      }

      if (config.makingCharges925Type === "percentage") {
        silver925MakingCharges = silver925WithGST * (config.makingCharges925Value / 100);
      } else {
        silver925MakingCharges = config.makingCharges925Value * 10;
      }
    }

    const gold999Final = gold999WithGST + gold999MakingCharges;
    const gold995Final = gold995WithGST + gold995MakingCharges;
    const gold916Final = gold916WithGST + gold916MakingCharges;
    const gold20kFinal = gold20kWithGST + gold20kMakingCharges;
    const gold18kFinal = gold18kWithGST + gold18kMakingCharges;
    const gold14kFinal = gold14kWithGST + gold14kMakingCharges;
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
      gold20k: {
        basePrice: gold20kBase,
        priceWithMargin: gold20kWithMargin,
        priceWithGST: gold20kWithGST,
        makingCharges: config.makingChargesEnabled
          ? gold20kMakingCharges
          : undefined,
        finalPrice: gold20kFinal,
      },
      gold18k: {
        basePrice: gold18kBase,
        priceWithMargin: gold18kWithMargin,
        priceWithGST: gold18kWithGST,
        makingCharges: config.makingChargesEnabled
          ? gold18kMakingCharges
          : undefined,
        finalPrice: gold18kFinal,
      },
      gold14k: {
        basePrice: gold14kBase,
        priceWithMargin: gold14kWithMargin,
        priceWithGST: gold14kWithGST,
        makingCharges: config.makingChargesEnabled
          ? gold14kMakingCharges
          : undefined,
        finalPrice: gold14kFinal,
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

export const getCalculatedEstimate = (design: any, calculatedRates: CalculatedRates | null) => {
  if (!design || !calculatedRates) return null;


  const rawWeight = (design.netWeight !== undefined && design.netWeight !== "") 
    ? design.netWeight 
    : (design.weight !== undefined && design.weight !== "")
      ? design.weight
      : design.grossWeight;
      
  const weightVal = parseFloat(rawWeight) || 0;
  if (weightVal <= 0) return null;

  const purityToKey: Record<string, keyof CalculatedRates> = {
    "24K": "gold999",
    "22K": "gold916",
    "20K": "gold20k",
    "18K": "gold18k",
    "14K": "gold14k",
    "Pure Silver": "silver999",
    "925 Sterling": "silver925",
  };

  const rateKey = purityToKey[design.purity];
  if (!rateKey || !calculatedRates[rateKey]) return null;


  const baseRate = calculatedRates[rateKey].priceWithGST || 0;
  
  const ratePerGram = baseRate / 10;

  const designMakingChargeVal = parseFloat(design.makingCharge || "0") || 0;
  const stoneChargesVal = parseFloat(design.stoneCharges || "0") || 0;

  let estimatedTotal = 0;
  const metalValue = ratePerGram * weightVal;

  if (design.makingChargeType === "percentage") {
    estimatedTotal = metalValue + (metalValue * (designMakingChargeVal / 100));
  } else {
    estimatedTotal = metalValue + (designMakingChargeVal * weightVal);
  }

  estimatedTotal += stoneChargesVal;

  return estimatedTotal;
};
