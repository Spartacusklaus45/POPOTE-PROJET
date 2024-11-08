import create from 'zustand';
import type { AdminStats, DeliveryZone, DeliveryTimeSlot, RecipeValidation } from '../types/admin';
import api from '../services/api';

interface AdminState {
  stats: AdminStats;
  zones: DeliveryZone[];
  timeSlots: DeliveryTimeSlot[];
  pendingValidations: RecipeValidation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  updateZone: (zone: DeliveryZone) => Promise<void>;
  deleteZone: (zoneId: string) => Promise<void>;
  updateTimeSlot: (slot: DeliveryTimeSlot) => Promise<void>;
  deleteTimeSlot: (slotId: string) => Promise<void>;
  validateRecipe: (validationId: string, approved: boolean, comments?: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    pendingValidations: 0,
    activeSubscriptions: 0,
    deliveryCapacity: []
  },
  zones: [],
  timeSlots: [],
  pendingValidations: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/admin/stats');
      set({ stats: response.data });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des statistiques' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateZone: async (zone: DeliveryZone) => {
    try {
      set({ isLoading: true });
      const response = await api.put(`/admin/zones/${zone.id}`, zone);
      set(state => ({
        zones: state.zones.map(z => z.id === zone.id ? response.data : z)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour de la zone' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteZone: async (zoneId: string) => {
    try {
      set({ isLoading: true });
      await api.delete(`/admin/zones/${zoneId}`);
      set(state => ({
        zones: state.zones.filter(z => z.id !== zoneId)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la suppression de la zone' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTimeSlot: async (slot: DeliveryTimeSlot) => {
    try {
      set({ isLoading: true });
      const response = await api.put(`/admin/time-slots/${slot.id}`, slot);
      set(state => ({
        timeSlots: state.timeSlots.map(s => s.id === slot.id ? response.data : s)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour du créneau' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTimeSlot: async (slotId: string) => {
    try {
      set({ isLoading: true });
      await api.delete(`/admin/time-slots/${slotId}`);
      set(state => ({
        timeSlots: state.timeSlots.filter(s => s.id !== slotId)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la suppression du créneau' });
    } finally {
      set({ isLoading: false });
    }
  },

  validateRecipe: async (validationId: string, approved: boolean, comments?: string) => {
    try {
      set({ isLoading: true });
      await api.put(`/admin/validations/${validationId}`, {
        approved,
        comments
      });
      set(state => ({
        pendingValidations: state.pendingValidations.filter(v => v.id !== validationId)
      }));
    } catch (error) {
      set({ error: 'Erreur lors de la validation de la recette' });
    } finally {
      set({ isLoading: false });
    }
  }
}));