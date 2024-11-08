export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  district: string;
  deliveryFee: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  isActive: boolean;
}

export interface DeliveryTimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  zoneId: string;
  isAvailable: boolean;
}

export interface DeliveryCapacity {
  date: string;
  timeSlotId: string;
  remainingCapacity: number;
  totalCapacity: number;
}

export interface RecipeValidation {
  id: string;
  recipeId: string;
  creatorId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerId?: string;
  comments?: string;
  validationScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  pendingValidations: number;
  activeSubscriptions: number;
  deliveryCapacity: DeliveryCapacity[];
}