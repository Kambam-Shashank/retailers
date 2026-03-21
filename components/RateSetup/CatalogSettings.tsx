import { useAuth } from "@/contexts/AuthContext";
import { Design, designService } from "@/services/designService";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useState, useMemo } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";


const CATEGORIES = [
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
const PURITIES = ["24K", "22K", "20K", "18K", "14K", "Pure Silver", "925 Sterling", "800 Silver"];
const METALS = ["Gold", "Silver", "Platinum", "Diamond"];
const PRICE_DISPLAY_OPTIONS = ["Price on Request", "Show Estimate"];
const STOCK_STATUS_OPTIONS = ["In Stock", "Out of Stock", "Available on Order"];
const TAG_OPTIONS = ["New Designs", "Limited Edition", "Best Sellers", "Wedding", "Festive", "Daily Wear", "Traditional", "Modern"];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#FBFBFB",
        maxWidth: 1000,
        width: "100%",
        alignSelf: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 14,
    },
    backNav: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
        marginBottom: 16,
    },
    backNavText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#64748B",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#1E293B",
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#94A3B8",
        marginTop: 4,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1B52B",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        gap: 8,
        shadowColor: "#F1B52B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    addButtonText: {
        fontWeight: "800",
        color: "#000",
        fontSize: 15,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterScroll: {
        gap: 6,
        paddingRight: 20,
    },
    categoryChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    categoryChipActive: {
        backgroundColor: "#F1B52B",
        borderColor: "#F1B52B",
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748B",
    },
    categoryChipTextActive: {
        color: "#FFF",
    },
    listContainer: {
        gap: 10,
        paddingBottom: 80,
    },
    listItem: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F1F5F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    itemImageContainer: {
        width: 86,
        height: 86,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#F8FAFC",
    },
    itemImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    itemInfo: {
        flex: 1,
        marginLeft: 20,
    },
    itemName: {
        fontSize: 19,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 6,
    },
    itemMeta: {
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    itemActions: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        paddingLeft: 10,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
    },
    emptyContainer: {
        paddingVertical: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#475569",
        marginTop: 20,
    },
    emptySubText: {
        fontSize: 15,
        color: "#94A3B8",
        textAlign: "center",
        marginTop: 10,
        paddingHorizontal: 40,
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
        alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    },
    modalContainer: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: Platform.OS === 'web' ? 32 : 0,
        borderBottomRightRadius: Platform.OS === 'web' ? 32 : 0,
        height: Platform.OS === 'web' ? '90%' : "94%",
        width: Platform.OS === 'web' ? '95%' : '100%',
        maxWidth: Platform.OS === 'web' ? 700 : undefined,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: "#1E293B",
    },
    modalSubTitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 4,
        fontWeight: "500",
    },
    modalForm: {
        padding: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#64748B",
        marginBottom: 10,
        marginTop: 20,
    },
    input: {
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        color: "#1E293B",
    },
    tripleRow: {
        flexDirection: "row",
        gap: 12,
    },
    doubleRow: {
        flexDirection: "row",
        gap: 16,
    },
    dropdownButton: {
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
    },
    dropdownList: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginTop: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    dropdownItemActive: {
        backgroundColor: '#FFFBEB',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#475569',
    },
    dropdownItemTextActive: {
        color: '#F1B52B',
        fontWeight: '800',
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    tagChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#FFF",
    },
    tagChipActive: {
        backgroundColor: "#FFFBEB",
        borderColor: "#F1B52B",
    },
    tagChipText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#64748B",
    },
    tagChipTextActive: {
        color: "#854D0E",
        fontWeight: "800",
    },
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 18,
        marginTop: 24,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E293B",
    },
    uploadArea: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",
        borderRadius: 20,
        padding: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        flexDirection: "column",
        gap: 14,
        marginTop: 10,
    },
    uploadAreaText: {
        fontSize: 15,
        color: "#94A3B8",
        fontWeight: "600",
    },
    previewWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: 400,
        aspectRatio: 1,
        borderRadius: 20,
        overflow: "hidden",
        alignSelf: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
    },
    imageActionRow: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    imageActionButton: {
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    imageActionText: {
        color: "#FFF",
        fontWeight: "800",
        fontSize: 12,
    },
    modalFooter: {
        flexDirection: "row",
        padding: 24,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#64748B",
    },
    submitButton: {
        flex: 2,
        backgroundColor: "#F1B52B",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#F1B52B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    submitButtonText: {
        fontSize: 17,
        fontWeight: "900",
        color: "#000",
    },
    disabledButton: {
        opacity: 0.5,
    },
    headerSaveButton: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    headerSaveText: {
        color: '#F1B52B',
        fontWeight: '900',
        fontSize: 15,
    },
    headerCloseButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Simple Dropdown Picker Component
const DropdownPicker = ({ label, value, options, onSelect }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (val: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <View style={{ flex: 1, zIndex: open ? 10 : 1 }}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setOpen(!open)}
            >
                <Text style={styles.dropdownButtonText} numberOfLines={1}>{value}</Text>
                <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
            </TouchableOpacity>
            {open && (
                <View style={styles.dropdownList}>
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.dropdownItem, value === opt && styles.dropdownItemActive]}
                                onPress={() => { onSelect(opt); setOpen(false); }}
                            >
                                <Text style={[styles.dropdownItemText, value === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export const CatalogSettings = ({ onBack }: { onBack?: () => void }) => {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isMobile = width < 420;
    const isSmallMobile = width < 360;
    const isDesktop = width >= 1024;
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageEditorVisible, setIsImageEditorVisible] = useState(false);
    const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"Manual" | "Name" | "Newest">("Manual");

    // Form State
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [purity, setPurity] = useState(PURITIES[1]);
    const [type, setType] = useState("Gold");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState("");
    const [makingCharge, setMakingCharge] = useState("");
    const [priceDisplay, setPriceDisplay] = useState(PRICE_DISPLAY_OPTIONS[0]);
    const [stockStatus, setStockStatus] = useState(STOCK_STATUS_OPTIONS[0]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [sortOrder, setSortOrder] = useState("1");
    const [makingChargeType, setMakingChargeType] = useState<"perGram" | "percentage">("perGram");
    const [sku, setSku] = useState("");
    const [grossWeight, setGrossWeight] = useState("");
    const [netWeight, setNetWeight] = useState("");
    const [stoneCharges, setStoneCharges] = useState("");

    const sortedDesigns = useMemo(() => {
        return [...designs].sort((a, b) => {
            if (sortBy === "Manual") {
                return (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999);
            }
            if (sortBy === "Name") {
                return (a.name || "").localeCompare(b.name || "");
            }
            if (sortBy === "Newest") {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            }
            return 0;
        });
    }, [designs, sortBy]);

    const handleToggleActive = async (design: Design) => {
        try {
            const newActive = design.isActive === false;
            await designService.updateDesign(design.id, { isActive: newActive });
            setDesigns(prev => prev.map(d => d.id === design.id ? { ...d, isActive: newActive } : d));
        } catch (error) {
            Alert.alert("Error", "Failed to update visibility.");
        }
    };

    const handleToggleStock = async (design: Design) => {
        try {
            const currentStock = design.stockStatus || "In Stock";
            const newStock = currentStock === "In Stock" ? "Out of Stock" : "In Stock";
            await designService.updateDesign(design.id, { stockStatus: newStock });
            setDesigns(prev => prev.map(d => d.id === design.id ? { ...d, stockStatus: newStock } : d));
        } catch (error) {
            Alert.alert("Error", "Failed to update stock status.");
        }
    };

    useEffect(() => {
        loadDesigns();
    }, [user]);

    const loadDesigns = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await designService.getRetailerDesigns(user.uid);
            setDesigns(data);
        } catch (error) {
            console.error("Failed to load designs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Needed", "Camera permission is required to take photos.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRotateImage = async () => {
        if (!imageUri) return;
        try {
            const result = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ rotate: 90 }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            setImageUri(result.uri);
        } catch (error) {
            console.error("Failed to rotate image:", error);
        }
    };

    const handleCropSquare = async () => {
        if (!imageUri) return;
        try {
            const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                Image.getSize(imageUri, (w, h) => resolve({ width: w, height: h }), reject);
            });
            const { width: originWidth, height: originHeight } = dimensions;
            const size = Math.min(originWidth, originHeight);
            const x = (originWidth - size) / 2;
            const y = (originHeight - size) / 2;
            const result = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ crop: { originX: x, originY: y, width: size, height: size } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            setImageUri(result.uri);
        } catch (error) {
            console.error("Failed to crop image:", error);
            Alert.alert("Error", "Could not crop image.");
        }
    };

    const resetForm = () => {
        setName("");
        setCategory(CATEGORIES[0]);
        setPurity(PURITIES[1]);
        setType("Gold");
        setImageUri(null);
        setDescription("");
        setWeight("");
        setMakingCharge("");
        setPriceDisplay(PRICE_DISPLAY_OPTIONS[0]);
        setStockStatus(STOCK_STATUS_OPTIONS[0]);
        setSelectedTags([]);
        setIsActive(true);
        setSortOrder("1");
        setMakingChargeType("perGram");
        setSku("");
        setGrossWeight("");
        setNetWeight("");
        setStoneCharges("");
        setEditingDesignId(null);
    };

    const handleEdit = (design: Design) => {
        setEditingDesignId(design.id);
        setName(design.name || "");
        setCategory(design.category || CATEGORIES[0]);
        setPurity(design.purity || PURITIES[1]);
        setType(design.type || "Gold");
        setImageUri(design.imageUrl || null);
        setDescription(design.description || "");
        setWeight(design.weight?.toString() || "");
        setMakingCharge(design.makingCharge?.toString() || "");
        setPriceDisplay(design.priceDisplay || PRICE_DISPLAY_OPTIONS[0]);
        setStockStatus(design.stockStatus || STOCK_STATUS_OPTIONS[0]);
        setSelectedTags(design.tags || []);
        setIsActive(design.isActive !== false);
        setSortOrder(design.sortOrder?.toString() || "1");
        setMakingChargeType(design.makingChargeType || "perGram");
        setSku(design.sku || "");
        setGrossWeight(design.grossWeight || design.weight || "");
        setNetWeight(design.netWeight || "");
        setStoneCharges(design.stoneCharges?.toString() || "");
        setIsModalVisible(true);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (!user) return;
        if (!name) {
            Alert.alert("Error", "Please provide a name for the design.");
            return;
        }

        try {
            setIsSubmitting(true);
            let finalImageUrl = imageUri || "";

            if (imageUri && !imageUri.startsWith('http') && !imageUri.startsWith('data:')) {
                // For now, we'll store as base64 to avoid Storage CORS issues
                const response = await fetch(imageUri);
                const blob = await response.blob();
                finalImageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
            }

            const designPayload = {
                name,
                category,
                purity,
                type,
                imageUrl: finalImageUrl,
                description,
                weight,
                makingCharge,
                priceDisplay,
                stockStatus,
                isActive,
                sortOrder: parseInt(sortOrder) || 1,
                makingChargeType,
                sku,
                grossWeight,
                netWeight,
                stoneCharges,
                tags: selectedTags,
                isNew: true,
                retailerId: user.uid,
            };

            if (editingDesignId) {
                await designService.updateDesign(editingDesignId, designPayload);
                Alert.alert("Success", "Design updated successfully.");
            } else {
                await designService.addDesign(designPayload);
                Alert.alert("Success", "Design added to your catalog.");
            }

            setIsModalVisible(false);
            resetForm();
            loadDesigns();
        } catch (error) {
            console.error("Failed to add design:", error);
            Alert.alert("Error", "Failed to upload design. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (design: Design) => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm("Are you sure you want to remove this design from your catalog?");
            if (confirmed) {
                const performDelete = async () => {
                    try {
                        await designService.deleteDesign(design.id, design.imageUrl);
                        loadDesigns();
                    } catch (error) {
                        window.alert("Failed to delete design.");
                    }
                };
                performDelete();
            }
        } else {
            Alert.alert(
                "Delete Design",
                "Are you sure you want to remove this design from your catalog?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                await designService.deleteDesign(design.id, design.imageUrl);
                                loadDesigns();
                            } catch (error) {
                                Alert.alert("Error", "Failed to delete design.");
                            }
                        }
                    }
                ]
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Loading Catalog...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Nav Row */}
            <TouchableOpacity style={styles.backNav} onPress={onBack}>
                <Feather name="arrow-left" size={isMobile ? 18 : 20} color="#64748B" />
                <Text style={[styles.backNavText, isMobile && { fontSize: 13 }]}>Back to Setup</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={[styles.title, { fontSize: isSmallMobile ? 22 : isMobile ? 26 : isDesktop ? 38 : 32 }]}>Product Catalogue</Text>
                    <Text style={[styles.subtitle, { fontSize: isSmallMobile ? 12 : isMobile ? 13 : 16 }]}>{designs.length} products</Text>
                </View>
                <TouchableOpacity
                    style={[styles.addButton, isMobile && { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 }]}
                    onPress={() => setIsModalVisible(true)}
                >
                    <MaterialCommunityIcons name="plus" size={isMobile ? 20 : 24} color="#000" />
                    <Text style={[styles.addButtonText, isMobile && { fontSize: 13 }]}>Add Product</Text>
                </TouchableOpacity>
            </View>

            {/* Category Filters */}
            <View style={styles.filterSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <TouchableOpacity 
                        style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]} 
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>All</Text>
                    </TouchableOpacity>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity 
                            key={cat} 
                            style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]} 
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {designs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="image-off-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No designs added yet</Text>
                    <Text style={styles.emptySubText}>Start building your digital catalog by adding your first design.</Text>
                </View>
            ) : (
            <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {sortedDesigns
                        .filter(d => !selectedCategory || d.category === selectedCategory)
                        .map((design) => (
                        <View key={design.id} style={[
                            styles.listItem,
                            design.isActive === false && { opacity: 0.7 },
                            isMobile && { padding: 10, borderRadius: 16 },
                        ]}>
                            <View style={[
                                styles.itemImageContainer,
                                isMobile && { width: 62, height: 62, borderRadius: 10 },
                            ]}>
                                {design.imageUrl ? (
                                    <Image source={{ uri: design.imageUrl }} style={styles.itemImage} />
                                ) : (
                                    <View style={[styles.itemImage, styles.imagePlaceholder]}>
                                        <MaterialCommunityIcons name="image-outline" size={isMobile ? 18 : 24} color="#CBD5E1" />
                                    </View>
                                )}
                            </View>
                            
                            <View style={[styles.itemInfo, isMobile && { marginLeft: 12 }]}>
                                <Text style={[styles.itemName, isMobile && { fontSize: 14, marginBottom: 3 }]} numberOfLines={1}>{design.name}</Text>
                                <Text style={[styles.itemMeta, isMobile && { fontSize: 12 }]}>
                                    {design.category} • {design.type} {design.purity}
                                </Text>
                            </View>

                            <View style={[styles.itemActions, isMobile && { gap: 4, paddingLeft: 4 }]}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, isMobile && { width: 32, height: 32, borderRadius: 16 }]}
                                    onPress={() => handleToggleStock(design)}
                                >
                                    <Feather
                                        name="box"
                                        size={isMobile ? 15 : 18}
                                        color={design.stockStatus === "In Stock" ? "#10B981" : "#EF4444"}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, isMobile && { width: 32, height: 32, borderRadius: 16 }]}
                                    onPress={() => handleToggleActive(design)}
                                >
                                    <MaterialCommunityIcons 
                                        name={design.isActive === false ? "eye-off-outline" : "eye-outline"} 
                                        size={isMobile ? 16 : 20} 
                                        color="#333" 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, isMobile && { width: 32, height: 32, borderRadius: 16 }]}
                                    onPress={() => handleEdit(design)}
                                >
                                    <MaterialCommunityIcons name="pencil-outline" size={isMobile ? 16 : 20} color="#333" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionBtn, isMobile && { width: 32, height: 32, borderRadius: 16 }]}
                                    onPress={() => handleDelete(design)}
                                >
                                    <MaterialCommunityIcons name="trash-can-outline" size={isMobile ? 16 : 20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Add Design Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>{editingDesignId ? "Edit Design" : "Add New Product"}</Text>
                                {editingDesignId && <Text style={styles.modalSubTitle}>Updating existing item</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isSubmitting || !name}
                                    style={[styles.headerSaveButton, (isSubmitting || !name) && { opacity: 0.5 }]}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color="#D4AF37" />
                                    ) : (
                                        <Text style={styles.headerSaveText}>Save</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.headerCloseButton}>
                                    <Feather name="x" size={20} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                            <View style={styles.doubleRow}>
                                <View style={{ flex: 1.5 }}>
                                    <Text style={[styles.label, { marginTop: 0 }]}>Product Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Royal Antique Necklace"
                                        placeholderTextColor="#94A3B8"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { marginTop: 0 }]}>SKU NO / TAG NO</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. KP-102"
                                        placeholderTextColor="#94A3B8"
                                        value={sku}
                                        onChangeText={setSku}
                                    />
                                </View>
                            </View>

                            {/* Description */}
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, { height: 90, textAlignVertical: "top" }]}
                                placeholder="Short description of the product..."
                                placeholderTextColor="#94A3B8"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />

                            {/* Category / Metal / Purity Row */}
                            <View style={styles.tripleRow}>
                                <DropdownPicker
                                    label="Category"
                                    value={category}
                                    options={CATEGORIES}
                                    onSelect={setCategory}
                                />
                                <DropdownPicker
                                    label="Metal"
                                    value={type}
                                    options={METALS}
                                    onSelect={setType}
                                />
                                <DropdownPicker
                                    label="Purity"
                                    value={purity}
                                    options={PURITIES}
                                    onSelect={setPurity}
                                />
                            </View>

                            {/* Weight / Making Charges Row */}
                            <View style={styles.doubleRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Gross Wt (g)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        placeholderTextColor="#94A3B8"
                                        value={grossWeight}
                                        onChangeText={setGrossWeight}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Net Wt (g)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        placeholderTextColor="#94A3B8"
                                        value={netWeight}
                                        onChangeText={setNetWeight}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.doubleRow}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                                        <Text style={[styles.label, { marginBottom: 0 }]}>Making Charge</Text>
                                        <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 2 }}>
                                            <TouchableOpacity
                                                onPress={() => setMakingChargeType("perGram")}
                                                style={[{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }, makingChargeType === "perGram" && { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }]}
                                            >
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: makingChargeType === "perGram" ? '#D4AF37' : '#64748B' }}>/G</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => setMakingChargeType("percentage")}
                                                style={[{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }, makingChargeType === "percentage" && { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }]}
                                            >
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: makingChargeType === "percentage" ? '#D4AF37' : '#64748B' }}>%</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={makingChargeType === "perGram" ? "e.g. 600" : "e.g. 6"}
                                        placeholderTextColor="#94A3B8"
                                        value={makingCharge}
                                        onChangeText={setMakingCharge}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Stone Charges (₹)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. 10000"
                                        placeholderTextColor="#94A3B8"
                                        value={stoneCharges}
                                        onChangeText={setStoneCharges}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Price Display / Stock Status Row */}
                            <View style={styles.doubleRow}>
                                <DropdownPicker
                                    label="Price Display"
                                    value={priceDisplay}
                                    options={PRICE_DISPLAY_OPTIONS}
                                    onSelect={setPriceDisplay}
                                />
                                <DropdownPicker
                                    label="Stock Status"
                                    value={stockStatus}
                                    options={STOCK_STATUS_OPTIONS}
                                    onSelect={setStockStatus}
                                />
                            </View>

                            {/* Tags / Collections */}
                            <Text style={styles.label}>Tags / Collections</Text>
                            <View style={styles.tagsContainer}>
                                {TAG_OPTIONS.map(tag => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                                        onPress={() => toggleTag(tag)}
                                    >
                                        <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>{tag}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Active Toggle */}
                            <View style={styles.toggleRow}>
                                <Text style={styles.toggleLabel}>Active (visible to customers)</Text>
                                <Switch
                                    value={isActive}
                                    onValueChange={setIsActive}
                                    trackColor={{ false: '#E2E8F0', true: '#D4AF37' }}
                                    thumbColor={isActive ? '#FFF' : '#F4F4F5'}
                                />
                            </View>

                            {/* Sort Order */}
                            <Text style={styles.label}>Sort Order (lower = first)</Text>
                            <TextInput
                                style={[styles.input, { width: 100 }]}
                                placeholder="1"
                                placeholderTextColor="#94A3B8"
                                value={sortOrder}
                                onChangeText={setSortOrder}
                                keyboardType="numeric"
                            />

                            {/* Product Images */}
                            <Text style={styles.label}>Product Images</Text>
                            {imageUri ? (
                                <View style={styles.previewWrapper}>
                                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                                    <View style={styles.imageActionRow}>
                                        <TouchableOpacity
                                            style={styles.imageActionButton}
                                            onPress={handleCropSquare}
                                        >
                                            <MaterialCommunityIcons name="crop-square" size={16} color="#FFF" />
                                            <Text style={styles.imageActionText}>Crop</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.imageActionButton}
                                            onPress={handleRotateImage}
                                        >
                                            <MaterialCommunityIcons name="rotate-right" size={16} color="#FFF" />
                                            <Text style={styles.imageActionText}>Rotate</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.imageActionButton}
                                            onPress={handlePickImage}
                                        >
                                            <Feather name="refresh-cw" size={14} color="#FFF" />
                                            <Text style={styles.imageActionText}>Change</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.uploadArea} onPress={handlePickImage}>
                                    <Feather name="upload" size={24} color="#94A3B8" />
                                    <Text style={styles.uploadAreaText}>Upload images (max 5MB each)</Text>
                                </TouchableOpacity>
                            )}

                            <View style={{ height: 40 }} />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : (
                                    <Text style={styles.submitButtonText}>{editingDesignId ? "Save Changes" : "Add to Catalog"}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


