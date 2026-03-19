import { db, storage } from "@/Firebaseconfig";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface Design {
    id: string;
    name: string;
    category: string;
    purity: string;
    type: string;
    imageUrl: string;
    description: string;
    isNew: boolean;
    retailerId: string;
    weight?: string;
    grossWeight?: string;
    netWeight?: string;
    sku?: string;
    stoneCharges?: string;
    makingCharge?: string;
    makingChargeType?: "perGram" | "percentage";
    priceDisplay?: string;
    stockStatus?: string;
    isActive?: boolean;
    sortOrder?: number;
    tags?: string[];
    createdAt: any;
}

const COLLECTION_NAME = "designs";

export const designService = {
    getRetailerDesigns: async (retailerId: string): Promise<Design[]> => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("retailerId", "==", retailerId)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Design[];
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Add a new design
    addDesign: async (designData: Omit<Design, 'id' | 'createdAt'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...designData,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    // Update an existing design
    updateDesign: async (designId: string, updates: Partial<Design>): Promise<void> => {
        try {
            const docRef = doc(db, COLLECTION_NAME, designId);
            await updateDoc(docRef, updates);
        } catch (error) {
            throw error;
        }
    },

    deleteDesign: async (designId: string, imageUrl?: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, designId));
            if (imageUrl) {
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef).catch(err => {});
            }
        } catch (error) {
            throw error;
        }
    },

    uploadImage: async (uri: string, retailerId: string): Promise<string> => {
        try {
            const manipResult = await manipulateAsync(
                uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: SaveFormat.JPEG }
            );

            const response = await fetch(manipResult.uri);
            const blob = await response.blob();

            const filename = `designs/${retailerId}/${Date.now()}.jpg`;
            const storageRef = ref(storage, filename);

            const uploadResult = await uploadBytes(storageRef, blob);
            return await getDownloadURL(uploadResult.ref);
        } catch (error: any) {
            throw error;
        }
    }
};
