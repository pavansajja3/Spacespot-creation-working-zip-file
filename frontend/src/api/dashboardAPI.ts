import api from "./axios";

export interface DashboardAnalytics {
  availableSpaces: number;
  rentedSpaces: number;
  revenue: number;
  occupancyRate: number;
  recentLeases: number;
  pendingBookings: number;
}

export interface MonthlyStats {
  month: string;
  available: number;
  rented: number;
  revenue: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  type: "deadline" | "important" | "reminder";
  customerId?: number;
  leaseId?: number;
  spaceId?: number;
}

export const dashboardAPI = {
  getSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  getAvailabilityData: async () => {
    const response = await api.get("/dashboard/availability");
    return response.data;
  },

  getSpaceStatistics: async () => {
    const response = await api.get("/spaces/statistics");
    return response.data?.data || response.data;
  },

  getMonthlyStats: async (year?: number, month?: number) => {
    const params = new URLSearchParams();

    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/dashboard/monthly-stats?${queryString}`
      : "/dashboard/monthly-stats";

    const response = await api.get(url);
    return response.data;
  },

  getOccupancyData: async () => {
    const response = await api.get("/dashboard/occupancy");
    return response.data;
  },

  getCalendarEvents: async (year: number, month: number) => {
    const response = await api.get(`/dashboard/events/${year}/${month}`);
    return response.data;
  },

  getRecentActivity: async (limit?: number) => {
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/dashboard/activity?${queryString}`
      : "/dashboard/activity";

    const response = await api.get(url);
    return response.data;
  },
};