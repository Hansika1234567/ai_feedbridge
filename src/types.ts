/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Donation {
  id: string;
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Supermarket' | 'Caterer' | 'Individual';
  contact: string;
  foodType: string;
  quantity: number; // in kg
  prepTime: string;
  expiryHours: number; // expiry window in hours
  location: string;
  suitabilityStatus: 'Pending' | 'Approved' | 'Rejected';
  classificationStr: string; // e.g., "Perishable - Cooked", "Shelf Stable"
  carbonFootprintSaved: number; // CO2 reduction in kg
  matchingStatus: 'Unmatched' | 'Matched' | 'Delivered';
  createdAt: string;
}

export interface NGO {
  id: string;
  name: string;
  location: string;
  contact: string;
  requestedFoodTypes: string[];
  quantityRequested: number; // in kg
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  predictedMonthlyNeed: number; // ML prediction in kg
  createdAt: string;
}

export interface Delivery {
  id: string;
  donationId: string;
  ngoId: string;
  routePlan: string[]; // stops in order
  spoilageRisk: 'Low' | 'Medium' | 'High';
  etaMinutes: number;
  volunteerName: string;
  vehicleType: 'Bicycle' | 'Motorcycle' | 'Car' | 'Refrigerated Van';
  status: 'Assigned' | 'Picked Up' | 'In Transit' | 'Delivered';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentName?: 'Donor Agent' | 'NGO Coordinator' | 'Logistics Agent' | 'Beneficiary Agent' | 'Analytics Agent' | 'Coordinator Master';
  text: string;
  timestamp: string;
  agentChain?: {
    agent: string;
    action: string;
    output: string;
  }[];
}

export interface DashboardMetrics {
  totalSavedKg: number;
  totalPeopleServed: number;
  totalCo2Saved: number;
  activeDonors: number;
  activeNgos: number;
  activeVolunteers: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'NGO Admin' | 'Food Donor' | 'Volunteer' | 'Beneficiary/Shelter';
  contact: string;
  location: string;
  avatarUrl: string;
  approvedStatus?: 'Pending' | 'Approved' | 'Rejected';
  joinedDate: string;
  points?: number; // Gamified reward system
}

export interface FoodInventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  storedTempCelsius: number;
  isInspected: boolean;
  notes: string;
}

export interface CampaignDrive {
  id: string;
  title: string;
  targetKg: number;
  currentKg: number;
  date: string;
  location: string;
  status: 'Draft' | 'Active' | 'Completed';
  registeredVolunteers: number;
}

