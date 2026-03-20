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
        maximumFractionDigits: 2,
    })}`;
};

export const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

export const getContrastColor = (backgroundColor: string) => {
    if (!backgroundColor) return '#5D4037';
    
    // Handle hex colors
    if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.length === 3 ? hex[0]+hex[0] : hex.substring(0, 2), 16);
        const g = parseInt(hex.length === 3 ? hex[1]+hex[1] : hex.substring(2, 4), 16);
        const b = parseInt(hex.length === 3 ? hex[2]+hex[2] : hex.substring(4, 6), 16);
        
        // Perceptive brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 150 ? '#5D4037' : '#FFFFFF';
    }

    // Default for translucent/other backgrounds
    return '#5D4037';
};
