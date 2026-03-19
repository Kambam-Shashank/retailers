import { useAuth } from "@/contexts/AuthContext";
import { Design, designService } from "@/services/designService";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useState, useMemo } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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
} from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2;

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

export const CatalogSettings = () => {
    const { user } = useAuth();
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageEditorVisible, setIsImageEditorVisible] = useState(false);
    const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
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
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Your Catalog</Text>
                    <View style={styles.sortSelector}>
                        <TouchableOpacity onPress={() => setSortBy("Manual")} style={[styles.sortChip, sortBy === "Manual" && styles.sortChipActive]}>
                            <Text style={[styles.sortChipText, sortBy === "Manual" && styles.sortChipTextActive]}>Manual</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSortBy("Name")} style={[styles.sortChip, sortBy === "Name" && styles.sortChipActive]}>
                            <Text style={[styles.sortChipText, sortBy === "Name" && styles.sortChipTextActive]}>Name</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSortBy("Newest")} style={[styles.sortChip, sortBy === "Newest" && styles.sortChipActive]}>
                            <Text style={[styles.sortChipText, sortBy === "Newest" && styles.sortChipTextActive]}>Newest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsModalVisible(true)}
                >
                    <MaterialCommunityIcons name="plus" size={24} color="#000" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            {designs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="image-off-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyText}>No designs added yet</Text>
                    <Text style={styles.emptySubText}>Start building your digital catalog by adding your first design.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.grid}>
                    {sortedDesigns.map((design) => (
                        <View key={design.id} style={[styles.card, design.isActive === false && { opacity: 0.8 }]}>
                            <View style={styles.cardImageWrapper}>
                                {design.imageUrl ? (
                                    <Image source={{ uri: design.imageUrl }} style={styles.cardImage} />
                                ) : (
                                    <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                                        <MaterialCommunityIcons name="image-outline" size={32} color="#CBD5E1" />
                                    </View>
                                )}
                                {design.isActive === false && (
                                    <View style={styles.inactiveBadge}>
                                        <Text style={styles.inactiveBadgeText}>Hidden From Display</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.cardDetails}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                    <Text style={[styles.cardName, { flex: 1 }]} numberOfLines={1}>{design.name}</Text>
                                    <Text style={styles.sortBadge}>#{design.sortOrder || 1}</Text>
                                </View>
                                <Text style={styles.cardMeta}>
                                    {design.sku ? `${design.sku} • ` : ""}{design.category} • {design.purity}
                                </Text>
                                <Text style={styles.cardMeta} numberOfLines={1}>
                                    {design.grossWeight ? `G: ${design.grossWeight}g ` : ""}
                                    {design.netWeight ? `N: ${design.netWeight}g` : ""}
                                    {!design.grossWeight && !design.netWeight && design.weight ? `Wt: ${design.weight}g` : ""}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.stockPill, design.stockStatus === "Out of Stock" ? styles.stockPillOOS : styles.stockPillIn]}
                                    onPress={() => handleToggleStock(design)}
                                >
                                    <View style={[styles.stockDot, design.stockStatus === "Out of Stock" ? { backgroundColor: '#EF4444' } : { backgroundColor: '#10B981' }]} />
                                    <Text style={[styles.stockPillText, design.stockStatus === "Out of Stock" ? { color: '#EF4444' } : { color: '#10B981' }]}>
                                        {design.stockStatus || "In Stock"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.actionButtonsRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, design.isActive === false && { backgroundColor: 'rgba(239,68,68,0.1)' }]}
                                    onPress={() => handleToggleActive(design)}
                                >
                                    <Feather name={design.isActive === false ? "eye-off" : "eye"} size={16} color={design.isActive === false ? "#EF4444" : "#10B981"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleEdit(design)}
                                >
                                    <Feather name="edit-2" size={16} color="#3B82F6" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: 'rgba(239,68,68,0.1)' }]}
                                    onPress={() => handleDelete(design)}
                                >
                                    <Feather name="trash-2" size={16} color="#EF4444" />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    loadingContainer: {
        padding: 60,
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E293B",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#D4AF37",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 6,
    },
    addButtonText: {
        fontWeight: "700",
        color: "#000",
    },
    emptyContainer: {
        padding: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#475569",
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: "#94A3B8",
        textAlign: "center",
        marginTop: 8,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        paddingBottom: 40,
    },
    card: {
        width: Platform.OS === 'web' ? 'auto' : COLUMN_WIDTH,
        minWidth: 160,
        maxWidth: Platform.OS === 'web' ? 240 : undefined,
        flex: Platform.OS === 'web' ? 1 : undefined,
        backgroundColor: "#FFF",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        position: "relative",
    },
    cardImage: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#F1F5F9",
    },
    cardImageWrapper: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#F1F5F9",
        position: 'relative',
    },
    cardImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inactiveBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    inactiveBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    cardDetails: {
        padding: 10,
    },
    cardName: {
        fontSize: 14,
        fontWeight: "800",
        color: "#1E293B",
    },
    cardMeta: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2,
    },
    cardStock: {
        fontSize: 11,
        color: "#EF4444",
        fontWeight: "600",
        marginTop: 2,
    },
    actionButtonsRow: {
        position: "absolute",
        top: 8,
        right: 8,
        flexDirection: "row",
        gap: 6,
    },
    actionButton: {
        backgroundColor: "rgba(255,255,255,0.95)",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
        alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    },
    modalContainer: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: Platform.OS === 'web' ? 24 : 0,
        borderBottomRightRadius: Platform.OS === 'web' ? 24 : 0,
        height: Platform.OS === 'web' ? '90%' : "92%",
        width: Platform.OS === 'web' ? '95%' : '100%',
        maxWidth: Platform.OS === 'web' ? 600 : undefined,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#5D4037",
    },
    modalForm: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#475569",
        marginBottom: 8,
        marginTop: 18,
    },
    input: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        color: "#1E293B",
    },
    tripleRow: {
        flexDirection: "row",
        gap: 10,
    },
    doubleRow: {
        flexDirection: "row",
        gap: 12,
    },
    // Dropdown styles
    dropdownButton: {
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
    },
    dropdownList: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    dropdownItemActive: {
        backgroundColor: '#FFFBEB',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#475569',
    },
    dropdownItemTextActive: {
        color: '#D4AF37',
        fontWeight: '700',
    },
    // Tags
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    tagChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#FFF",
    },
    tagChipActive: {
        backgroundColor: "#FFFBEB",
        borderColor: "#D4AF37",
    },
    tagChipText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#64748B",
    },
    tagChipTextActive: {
        color: "#5D4037",
        fontWeight: "700",
    },
    // Toggle row
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1E293B",
    },
    // Upload area
    uploadArea: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",
        borderRadius: 16,
        padding: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        flexDirection: "row",
        gap: 10,
        width: "100%",
        maxWidth: 400,
        alignSelf: 'center',
    },
    uploadAreaText: {
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    previewWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: 400,
        aspectRatio: 1,
        borderRadius: 16,
        overflow: "hidden",
        alignSelf: 'center',
    },
    imagePreview: {
        width: "100%",
        height: "100%",
    },
    imageActionRow: {
        position: "absolute",
        bottom: 12,
        left: 12,
        right: 12,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    imageActionButton: {
        backgroundColor: "rgba(0,0,0,0.7)",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    imageActionText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 11,
    },
    modalFooter: {
        flexDirection: "row",
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
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
        backgroundColor: "#D4AF37",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#000",
    },
    disabledButton: {
        opacity: 0.6,
    },
    modalSubTitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    headerSaveButton: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    headerSaveText: {
        color: '#D4AF37',
        fontWeight: '800',
        fontSize: 14,
    },
    headerCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortSelector: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6,
    },
    sortChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    sortChipActive: {
        backgroundColor: "#FFFBEB",
        borderColor: "#D4AF37",
    },
    sortChipText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#64748B",
    },
    sortChipTextActive: {
        color: "#5D4037",
    },
    sortBadge: {
        fontSize: 10,
        fontWeight: "700",
        color: "#D4AF37",
        backgroundColor: "#FFFBEB",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 4,
    },
    stockPill: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
    },
    stockPillIn: {
        backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
    stockPillOOS: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    stockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    stockPillText: {
        fontSize: 11,
        fontWeight: "700",
    },
});
