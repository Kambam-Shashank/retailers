import { useCallback, useEffect, useRef, useState } from "react";


export const CATEGORIES = [
    "All",
    "Necklace",
    "Ring",
    "Chain",
    "Bangle",
    "Bracelet",
    "Earring",
    "Coin",
    "Anklet",
    "Pendant",
    "Bajubandh",
    "Hathpan",
    "Nose pin",
    "Nose ring",
    "Mangalsutra",
    "Dokiya",
    "Kamarbandh",
    "Shishful",
    "Maang Tika",
    "Rakhdi",
    "Jhele",
    "Hair Clips",
    "Payal",
    "Bicchiya",
    "Others"
];

export function useFetch<T = any>(
    url: string,
    options: { responseType?: "json" | "text" } = {}
): {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            let result;
            if (options.responseType === "text") {
                result = (await response.text()) as unknown as T;
            } else {
                result = await response.json();
            }
            setData(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }, [url, options.responseType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// ======= useAaravRates (live gold/silver rates from Aarav Bullion API) =======

export interface AaravRateData {
    silver?: number;
    gold?: number;
    silverWithGST?: boolean;
    goldWithGST?: boolean;
}

const AARAV_API_URL =
    "https://bcast.aaravbullion.in/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/aarav?_=1765790390896";

const POLL_INTERVAL_MS = 10000;

export const useAaravRates = () => {
    const { data: rawData, error: fetchError, refetch } = useFetch<string>(
        AARAV_API_URL,
        { responseType: "text" }
    );
    const [lastValidData, setLastValidData] = useState<AaravRateData>({});
    const [parsedError, setParsedError] = useState<string | null>(null);
    const fetchCountRef = useRef(0);

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
                        newData.goldWithGST = true;
                    }
                    if (id === "2128") {
                        newData.silver = validPrice / 100;
                        newData.silverWithGST = true;
                    }
                }
            });

            if (newData.silver || newData.gold) {
                fetchCountRef.current += 1;
                setLastValidData(newData);
            }
            setParsedError(null);
        } catch (err) {
            setParsedError("Failed to parse rates");
        }
    }, [rawData]);

    // Auto-poll every 10 seconds
    useEffect(() => {
        const interval = setInterval(refetch, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [refetch]);

    return { data: lastValidData, error: fetchError || parsedError };
};

// ======= useDesignCatalog (fetching and filtering) =======
import { Design, designService } from "@/services/designService";
import { useMemo } from "react";

export const useDesignCatalog = (retailerId: string | undefined) => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        let isMounted = true;
        const fetchDesigns = async () => {
            if (!retailerId) {
                return;
            }
            try {
                setLoading(true);
                const data = await designService.getRetailerDesigns(retailerId);
                if (isMounted) setDesigns(data);
            } catch (error) {
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchDesigns();
        return () => { isMounted = false; };
    }, [retailerId]);

    const availableCategories = useMemo(() => {
        const categoriesInUse = new Set(designs.map(d => d.category).filter(Boolean));
        // Always include "All" at the beginning
        return ["All", ...CATEGORIES.filter(c => c !== "All" && categoriesInUse.has(c))];
    }, [designs]);

    const filteredDesigns = useMemo(() => {
        return designs.filter(design => {
            if (design.isActive === false) return false;

            const name = design.name || "";
            const purity = design.purity || "";
            const type = design.type || "";
            const desc = design.description || "";
            const category = design.category || "";

            const matchesSearch =
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                purity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                desc.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                !selectedCategory ||
                selectedCategory === "All" ||
                category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        })
            .sort((a, b) => (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999));
    }, [designs, searchQuery, selectedCategory]);

    return {
        designs,
        filteredDesigns,
        availableCategories,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
    };
};

