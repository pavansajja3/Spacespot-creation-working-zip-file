// User Types
export interface User {
  id: number;
  email: String;
  password_hash: String;
  first_name: string;
  last_name: string;
  role: String;
  is_active: Boolean;
  email_verified: Boolean;
  phone: string | null;
  avatar_url: String;
  last_login_at: Date;
}

// Customer Types
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: Record<string, any> | null;
  contactPreferences: Record<string, any> | null;
  status: 'active' | 'inactive' | 'suspended' | 'archived';
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

// Space Types
export interface Space {
  id: number;
  name: string;
  buildingType: string | null;
  buildingClass: string | null;
  address: Record<string, any>;
  totalArea: number | null;
  description: string | null;
  features: Record<string, any> | null;
  amenities: Record<string, any> | null;
  status: 'draft' | 'active' | 'maintenance' | 'inactive' | 'archived';
  createdBy: number | null;
}

// Unit Types
export interface Unit {
  id: number;
  spaceId: number;
  floorId: number | null;
  unitNumber: string;
  unitName: string | null;
  totalArea: number | null;
  description: string | null;
  features: Record<string, any> | null;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'archived';
  occupancyStatus: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'archived';
}

// Lease Types
export interface Lease {
  id: number;
  leaseReference: string;
  customerId: number;
  unitId: number;
  spaceId: number;
  leaseType: 'full_lease' | 'partial_lease' | 'co_working';
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number | null;
  currency: string;
  renewalOptions: Record<string, any> | null;
  terms: Record<string, any> | null;
  specialConditions: string | null;
  notes: string | null;
  metadata: Record<string, any> | null;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'terminated' | 'cancelled';
  signedAt: string | null;
  signedBy: number | null;
}

// Booking Types
export interface Booking {
  id: number;
  unitId: number;
  customerId: number;
  bookingDate: string;
  durationDays: number;
  purpose: string | null;
  expectedGuests: number | null;
  specialRequests: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out';
  confirmedAt: string | null;
  confirmedBy: number | null;
}

// Payment Types
export interface Payment {
  id: number;
  leaseId: number;
  amount: number;
  paymentType: 'rent' | 'deposit' | 'fee' | 'other';
  paymentMethod: string | null;
  transactionId: string | null;
  dueDate: string;
  paidAt: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial';
  notes: string | null;
  metadata: Record<string, any> | null;
}

// Document Types
export interface Document {
  id: number;
  documentType: string;
  title: string;
  description: string | null;
  leaseId: number | null;
  unitId: number | null;
  customerId: number | null;
  fileUrl: string | null;
  fileType: string | null;
  fileSize: number | null;
  version: number;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'active' | 'archived';
  uploadedBy: number | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  notes: string | null;
  metadata: Record<string, any> | null;
}

// Notification Types
export interface Notification {
  id: number;
  userId: number;
  type: 'info' | 'warning' | 'error' | 'success';
  recipientId: number;
  title: string | null;
  message: string;
  category: 'general' | 'lease' | 'payment' | 'booking' | 'document';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  readAt: string | null;
  actionUrl: string | null;
  expiresAt: string | null;
}
