export const formatTime = (date: Date) => {
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export const formatPricePerGram = (price: number) => {
    const perGram = price / 10;
    return `₹${perGram.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
};
