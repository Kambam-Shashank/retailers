import { useEffect, useState } from "react";
import useFetch from "./useFetch";

export interface AaravRateData {
  silver?: number;
  gold?: number;
  silverWithGST?: boolean;
  goldWithGST?: boolean;
}

const AARAV_API_URL =
  "https://bcast.aaravbullion.in/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/aarav?_=1765790390896";

export const useAaravRates = () => {
  const {
    data: rawData,
    error: fetchError,
    refetch,
  } = useFetch<string>(AARAV_API_URL, { responseType: "text" });
  const [lastValidData, setLastValidData] = useState<AaravRateData>({});
  const [parsedError, setParsedError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawData) return;

    try {
      const lines = rawData.trim().split("\n");
      const newData: AaravRateData = {};

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/\s+/);
        if (parts.length < 4) return;

        const id = parts[0]?.trim();
        const bid = parseFloat(parts[2]?.trim());
        const ask = parseFloat(parts[3]?.trim());
        const validPrice = !isNaN(ask) ? ask : bid;

        if (!isNaN(validPrice)) {
          if (id === "2129") {
            newData.gold = validPrice;
            newData.goldWithGST = true; // Aarav API prices include GST
          }
          if (id === "2128") {
            const silverPerTenGram = validPrice / 100;
            newData.silver = silverPerTenGram;
            newData.silverWithGST = true; // Aarav API prices include GST
          }
        }
      });

      if (newData.silver || newData.gold) {
        setLastValidData(newData);
      }
      setParsedError(null);
    } catch (err) {
      console.error("Failed to parse Aarav rates", err);
      setParsedError("Failed to parse rates");
    }
  }, [rawData]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  return { data: lastValidData, error: fetchError || parsedError };
};
