import { useEffect, useRef, useState } from "react";

export interface PriceChangeInfo {
    change: number;
    percentageChange: number;
    isIncrease: boolean;
    isDecrease: boolean;
    hasChanged: boolean;
}

export const usePriceChange = (currentPrice: number) => {
    const [changeInfo, setChangeInfo] = useState<PriceChangeInfo>({
        change: 0,
        percentageChange: 0,
        isIncrease: false,
        isDecrease: false,
        hasChanged: false,
    });
    const previousPriceRef = useRef<number>(currentPrice);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (currentPrice && currentPrice !== previousPriceRef.current && previousPriceRef.current > 0) {
            const change = currentPrice - previousPriceRef.current;
            const percentageChange = (change / previousPriceRef.current) * 100;

            // Clear any existing timeout
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }

            // Show the change
            setChangeInfo({
                change,
                percentageChange,
                isIncrease: change > 0,
                isDecrease: change < 0,
                hasChanged: true,
            });

            // Hide after 1 second
            hideTimeoutRef.current = setTimeout(() => {
                setChangeInfo({
                    change: 0,
                    percentageChange: 0,
                    isIncrease: false,
                    isDecrease: false,
                    hasChanged: false,
                });
            }, 1000);

            previousPriceRef.current = currentPrice;
        } else if (currentPrice && previousPriceRef.current === 0) {
            // First time setting the price
            previousPriceRef.current = currentPrice;
        }
    }, [currentPrice]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    return changeInfo;
};
