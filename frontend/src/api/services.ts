console.log("LOADED SERVICES.TS");
import api from './axios';
import type { 
  Customer, 
  Space, 
  Unit, 
  Lease, 
  Booking, 
  Payment,
  Document,
  Notification 
} from '../types/models';

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
    localStorage.setItem('authToken', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
    return response.data;
   },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      newPassword,
    });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Customer Service
export const customerService = {
  getAll: async (filters?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/customers?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Customer>) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Customer>) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

// Space Service
export const spaceService = {
  getAll: async (filters?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/spaces?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Space>) => {
    console.log("CreateService.create ...");
    const response = await api.post('/spaces', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Space>) => {
    const response = await api.put(`/spaces/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/spaces/${id}`);
    return response.data;
  },
};

// Unit Service
export const unitService = {
  getAll: async (filters?: { spaceId?: number; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.spaceId) params.append('spaceId', filters.spaceId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/units?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Unit>) => {
    const response = await api.post('/units', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Unit>) => {
    const response = await api.put(`/units/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },
};

// Lease Service
export const leaseService = {
  getAll: async (filters?: { customerId?: number; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.customerId) params.append('customerId', filters.customerId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/leases?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/leases/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Lease>) => {
    const response = await api.post('/leases', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Lease>) => {
    const response = await api.put(`/leases/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/leases/${id}`);
    return response.data;
  },
  
  sign: async (id: number, signedBy: number) => {
    const response = await api.post(`/leases/${id}/sign`, { signedBy });
    return response.data;
  },
};

// Booking Service
export const bookingService = {
  getAll: async (filters?: { unitId?: number; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.unitId) params.append('unitId', filters.unitId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/bookings?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Booking>) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Booking>) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  
  confirm: async (id: number, confirmedBy: number) => {
    const response = await api.post(`/bookings/${id}/confirm`, { confirmedBy });
    return response.data;
  },
};

// Payment Service
export const paymentService = {
  getAll: async (filters?: { leaseId?: number; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.leaseId) params.append('leaseId', filters.leaseId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/payments?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Payment>) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Payment>) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
  
  process: async (id: number) => {
    const response = await api.post(`/payments/${id}/process`);
    return response.data;
  },
};

// Document Service
export const documentService = {
  getAll: async (filters?: { leaseId?: number; status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.leaseId) params.append('leaseId', filters.leaseId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/documents?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  
  upload: async (file: File, metadata: Partial<Document>) => {
    const formData = new FormData();
    formData.append('documents', file);
    formData.append('title', metadata.title || '');
    formData.append('document_type', metadata.document_type || 'other');
    if (metadata.leaseId) formData.append('leaseId', metadata.leaseId.toString());
    
    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  update: async (id: number, data: Partial<Document>) => {
    const response = await api.put(`/documents/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

// Notification Service
export const notificationService = {
  getAll: async (filters?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.unreadOnly) params.append('unreadOnly', 'true');
    
    const response = await api.get(`/notifications?${params.toString()}`);
    return response.data;
  },
  
  markAsRead: async (id: number) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};