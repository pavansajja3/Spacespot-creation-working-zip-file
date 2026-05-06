import { useState, useEffect } from "react";
import { dashboardAPI } from "../api/dashboardAPI";

interface DashboardData {
  summary: {
    availableSpaces: number;
    rentedSpaces: number;
    leasesClosedLastMonth: number;
    precinct: string;
    fastLeasing: string;
  };
  monthlyStats: Array<{
    month: string;
    available: number;
    rented: number;
    revenue: number;
  }>;
  occupancyData: Array<{
    id: string;
    name: string;
    value: number;
  }>;
  calendarEvents: Array<{
    year: number;
    month: number;
    day: number;
    type: "deadline" | "important";
    title: string;
  }>;
  availabilityData: Array<{
    id: string;
    month: string;
    available: number;
    rented: number;
  }>;
  analyticsData: Array<{
    id: string;
    month: string;
    available: number;
    rented: number;
    revenue: number;
  }>;
  loading: boolean;
  error: string | null;
}

export function useDashboard(): DashboardData {
  const [summary, setSummary] = useState({
    availableSpaces: 0,
    rentedSpaces: 0,
    leasesClosedLastMonth: 0,
    precinct: "Live Data",
    fastLeasing: "No rented units"
  });

  const [monthlyStats, setMonthlyStats] = useState<DashboardData["monthlyStats"]>([]);
  const [occupancyData, setOccupancyData] = useState<DashboardData["occupancyData"]>([]);
  const [calendarEvents, setCalendarEvents] = useState<DashboardData["calendarEvents"]>([]);
  const [availabilityData, setAvailabilityData] = useState<DashboardData["availabilityData"]>([]);
  const [analyticsData, setAnalyticsData] = useState<DashboardData["analyticsData"]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

       const [
              summaryRes,
              occupancyRes,
              monthlyRes,
              eventsRes,
            ] = await Promise.all([
              dashboardAPI.getSummary(),
              dashboardAPI.getOccupancyData(),
              dashboardAPI.getMonthlyStats(),
              dashboardAPI.getCalendarEvents(
                new Date().getFullYear(),
                new Date().getMonth() + 1
              ),
            ]);

            setSummary(summaryRes);
            setOccupancyData(occupancyRes);
            setMonthlyStats(monthlyRes);
            setAnalyticsData(monthlyRes);
            setCalendarEvents(eventsRes);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    summary,
    monthlyStats,
    occupancyData,
    calendarEvents,
    availabilityData,
    analyticsData,
    loading,
    error
  };
}