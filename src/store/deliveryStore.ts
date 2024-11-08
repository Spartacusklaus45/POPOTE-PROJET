import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeliverySlot {
  id: string;
  date: string;
  timeSlot: string;
  available: boolean;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  district: string;
  additionalInfo?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface DeliveryState {
  selectedSlot: DeliverySlot | null;
  address: DeliveryAddress | null;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  } | null;
  deliveryFee: number;
  
  // Actions
  setSelectedSlot: (slot: DeliverySlot) => void;
  setAddress: (address: DeliveryAddress) => void;
  setContactInfo: (info: { name: string; phone: string; email: string }) => void;
  calculateDeliveryFee: (address: DeliveryAddress) => number;
  clearDeliveryInfo: () => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set, get) => ({
      selectedSlot: null,
      address: null,
      contactInfo: null,
      deliveryFee: 0,

      setSelectedSlot: (slot) => set({ selectedSlot: slot }),
      
      setAddress: (address) => {
        const deliveryFee = get().calculateDeliveryFee(address);
        set({ address, deliveryFee });
      },
      
      setContactInfo: (info) => set({ contactInfo: info }),
      
      calculateDeliveryFee: (address) => {
        // Zones de livraison et tarifs
        const zones = {
          'Cocody': 1000,
          'Plateau': 1000,
          'Marcory': 1000,
          'Yopougon': 1500,
          'Abobo': 1500,
          'Koumassi': 1500,
          'Bingerville': 2000,
          'Grand-Bassam': 2000
        };
        
        return zones[address.city as keyof typeof zones] || 2000;
      },
      
      clearDeliveryInfo: () => set({
        selectedSlot: null,
        address: null,
        contactInfo: null,
        deliveryFee: 0
      })
    }),
    {
      name: 'delivery-storage'
    }
  )
);