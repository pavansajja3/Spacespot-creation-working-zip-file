import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calendar as CalendarIcon,
  Building2,
  FileCheck,
  MapPin,
  Zap,
  Key,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDashboard } from "../src/hooks/useDashboard";

interface CalendarEvent {
  year: number;
  month: number;
  day: number;
  type: "deadline" | "important";
  title: string;
}

export default function Home() {
  const navigate = useNavigate();

  const {
    summary,
    occupancyData,
    calendarEvents,
    analyticsData,
    loading,
    error,
  } = useDashboard();

  const [availabilityView, setAvailabilityView] = useState<"monthly" | "quarterly" | "ytd">("monthly");
  const [availabilitySeries, setAvailabilitySeries] = useState({
    available: true,
    rented: true,
  });

  const today = useMemo(() => new Date(), []);

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());

  const goToSpaces = (filter: string) => {
  if (filter === "leases") {
    navigate("/manage/leases", {
      state: { filter: "closedLastMonth" },
    });
    return;
  }

  navigate("/manage/spaces", {
    state: { dashboardFilter: filter },
  });
};

  const selectedMonthName = useMemo(() => {
    return currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayArray: (number | null)[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      dayArray.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      dayArray.push(d);
    }

    return dayArray;
  }, [currentDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();

    for (const event of calendarEvents || []) {
      if (
        event.year === currentDate.getFullYear() &&
        event.month - 1 === currentDate.getMonth()
      ) {
        const list = map.get(event.day) ?? [];
        list.push(event);
        map.set(event.day, list);
      }
    }

    return map;
  }, [currentDate, calendarEvents]);

  const selectedDateEvents = selectedDate
    ? eventsByDay.get(selectedDate) ?? []
    : [];

  const handleMonthChange = (delta: number) => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );

    const daysInNextMonth = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1,
      0
    ).getDate();

    setCurrentDate(nextDate);
    setSelectedDate((prev) =>
      prev === null ? null : Math.min(prev, daysInNextMonth)
    );
  };

  const availabilityData = useMemo(() => {
    if (availabilityView === "monthly") {
      return (analyticsData || []).map((point) => ({
        id: point.id,
        label: point.month,
        available: point.available,
        rented: point.rented,
        revenue: point.revenue,
      }));
    }

    if (availabilityView === "quarterly") {
      const quarters: Record<string, { available: number; rented: number }> = {
        Q1: { available: 0, rented: 0 },
        Q2: { available: 0, rented: 0 },
        Q3: { available: 0, rented: 0 },
        Q4: { available: 0, rented: 0 },
      };

      (analyticsData || []).forEach((point, index) => {
        const quarterKey =
          index < 3 ? "Q1" : index < 6 ? "Q2" : index < 9 ? "Q3" : "Q4";

        quarters[quarterKey].available += point.available || 0;
        quarters[quarterKey].rented += point.rented || 0;
      });

      return Object.entries(quarters).map(([label, values]) => ({
        id: `availability-${label.toLowerCase()}`,
        label,
        available: values.available,
        rented: values.rented,
      }));
    }

    let availableRunning = 0;
    let rentedRunning = 0;

    return (analyticsData || []).map((point, index) => {
      availableRunning += point.available || 0;
      rentedRunning += point.rented || 0;

      return {
        id: `availability-ytd-${index}`,
        label: point.month?.substring(0, 3) || `M${index + 1}`,
        available: availableRunning,
        rented: rentedRunning,
      };
    });
  }, [availabilityView, analyticsData]);

  const availabilityMax = useMemo(() => {
    if (availabilityData.length === 0) return 1;

    return Math.max(
      ...availabilityData.map((point) =>
        Math.max(point.available || 0, point.rented || 0)
      )
    );
  }, [availabilityData]);

  const getLollipopHeight = (value: number) => {
    return Math.max(22, Math.round((value / (availabilityMax || 1)) * 180));
  };

  const toggleAvailabilitySeries = (series: "available" | "rented") => {
    setAvailabilitySeries((prev) => {
      const next = { ...prev, [series]: !prev[series] };

      if (!next.available && !next.rented) {
        return prev;
      }

      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1342px] mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-[var(--spacespot-text-primary)] text-2xl">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1342px] mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  const dashboardCardClass =
    "bg-[var(--spacespot-card-surface)] p-4 sm:p-5 rounded-[14px] border border-[var(--spacespot-card-border)] shadow-sm min-w-0 hover:shadow-lg hover:scale-105 hover:border-[var(--spacespot-cyan-primary)] transition-all duration-300 cursor-pointer";

  return (
    <div className="max-w-[1342px] mx-auto">
      <h2 className="text-[45px] font-normal opacity-81 mb-6 animate-fade-in text-[var(--spacespot-text-primary)]">
        Welcome
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 mb-6">
        <div className="p-4 sm:p-6 rounded-[14px] shadow-[var(--spacespot-shadow-lg)] border-2 border-[var(--spacespot-cyan-primary)] bg-[linear-gradient(135deg,var(--spacespot-dashboard-panel-start)_0%,var(--spacespot-dashboard-panel-mid)_55%,var(--spacespot-dashboard-panel-end)_100%)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[28px] font-semibold text-[var(--spacespot-text-primary)] flex items-center gap-3">
              <TrendingUp
                className="text-[var(--spacespot-cyan-primary)]"
                size={24}
              />
              Visual Analytics
            </h3>

            <div className="px-5 py-2.5 bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)] rounded-lg text-[14px] font-semibold">
              This Month
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div onClick={() => goToSpaces("available")} className={dashboardCardClass}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center shadow-sm">
                  <Building2 size={20} className="text-[var(--spacespot-gray-900)]" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight text-[12px]">
                    Available Spaces
                  </p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">
                    {summary.availableSpaces || 0}
                  </p>
                </div>
              </div>
            </div>

            <div onClick={() => goToSpaces("rented")} className={dashboardCardClass}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#14D8CC] rounded-full flex items-center justify-center shadow-sm">
                  <Key size={20} className="text-[var(--spacespot-gray-900)]" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight text-[12px]">
                    Rented Spaces
                  </p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">
                    {summary.rentedSpaces || 0}
                  </p>
                </div>
              </div>
            </div>

            <div onClick={() => goToSpaces("leases")} className={dashboardCardClass}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-sm">
                  <FileCheck size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight text-[12px]">
                    Leases Closed Last Month
                  </p>
                  <p className="text-[28px] font-bold text-[var(--spacespot-text-primary)]">
                    {summary.leasesClosedLastMonth || 0}
                  </p>
                </div>
              </div>
            </div>

            <div onClick={() => goToSpaces("precinct")} className={dashboardCardClass}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight text-[12px]">
                    Precinct
                  </p>
                  <p className="text-[16px] font-bold text-[var(--spacespot-text-primary)]">
                    {summary.precinct || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div onClick={() => goToSpaces("fastLeasing")} className={dashboardCardClass}>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-[#EF4444] rounded-lg flex items-center justify-center shadow-sm">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[var(--spacespot-text-secondary)] uppercase tracking-wide leading-tight text-[12px]">
                    Fast Leasing
                  </p>
                  <p className="text-[16px] font-bold text-[var(--spacespot-text-primary)]">
                    {summary.fastLeasing || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr] gap-4">
            <div className="bg-[var(--spacespot-card-surface)] p-4 rounded-lg border border-[var(--spacespot-card-border)] shadow-md">
              <h4 className="text-[16px] font-semibold text-[var(--spacespot-text-primary)] mb-3">
                Revenue Trend
              </h4>

              {analyticsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--spacespot-chart-grid)" />
                    <XAxis dataKey="month" stroke="var(--spacespot-text-secondary)" style={{ fontSize: "12px" }} />
                    <YAxis stroke="var(--spacespot-text-secondary)" style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--spacespot-cyan-primary)"
                      strokeWidth={3}
                      dot={{ fill: "var(--spacespot-cyan-primary)", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-[var(--spacespot-text-secondary)]">
                  No revenue data available
                </div>
              )}
            </div>

            <div className="bg-[var(--spacespot-card-surface)] p-4 rounded-lg border border-[var(--spacespot-card-border)] shadow-md">
              <h4 className="text-[16px] font-semibold text-[var(--spacespot-text-primary)] mb-3">
                Occupancy Rate
              </h4>

              {occupancyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell
                          key={`pie-cell-${entry.id || index}`}
                          fill={
                            ["var(--spacespot-cyan-primary)", "var(--spacespot-gray-500)"][
                              index % 2
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-[var(--spacespot-text-secondary)]">
                  No occupancy data available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="bg-[var(--spacespot-calendar-surface)] rounded-[14px] border-2 border-[var(--spacespot-cyan-primary)] shadow-[var(--spacespot-shadow-lg)] p-5">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => handleMonthChange(-1)}
                className="w-9 h-9 rounded-lg bg-[var(--spacespot-cyan-primary)] flex items-center justify-center text-[var(--spacespot-gray-900)]"
              >
                <ChevronLeft size={12} />
              </button>

              <div className="flex items-center gap-2 text-white text-[28px] font-semibold">
                <CalendarIcon size={26} className="text-[var(--spacespot-cyan-primary)]" />
                {selectedMonthName}
              </div>

              <button
                onClick={() => handleMonthChange(1)}
                className="w-9 h-9 rounded-lg bg-[var(--spacespot-cyan-primary)] flex items-center justify-center text-[var(--spacespot-gray-900)]"
              >
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-[var(--spacespot-cyan-primary)] uppercase text-[14px] font-semibold tracking-wider mb-2">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {calendarDays.map((day, idx) => {
                const isSelected = day !== null && day === selectedDate;
                const isToday =
                  day !== null &&
                  currentDate.getFullYear() === today.getFullYear() &&
                  currentDate.getMonth() === today.getMonth() &&
                  day === today.getDate();

                const dayEvents = day !== null ? eventsByDay.get(day) ?? [] : [];
                const hasDeadline = dayEvents.some((event) => event.type === "deadline");
                const hasImportant = dayEvents.some((event) => event.type === "important");

                return (
                  <button
                    key={`${idx}-${day}`}
                    disabled={day === null}
                    onClick={() => day && setSelectedDate(day)}
                    className={`h-11 rounded-lg flex items-center justify-center font-semibold relative ${
                      day === null
                        ? "text-transparent bg-transparent pointer-events-none"
                        : isSelected
                        ? "bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)]"
                        : isToday
                        ? "bg-[var(--spacespot-calendar-cell)] text-white border border-[var(--spacespot-cyan-primary)]"
                        : "bg-[var(--spacespot-calendar-cell)] text-white border border-[var(--spacespot-calendar-divider)]"
                    }`}
                  >
                    {day ?? ""}

                    {day !== null && dayEvents.length > 0 && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {hasDeadline && <span className="w-2 h-2 rounded-full bg-[#EF4444]" />}
                        {hasImportant && <span className="w-2 h-2 rounded-full bg-[#F9A826]" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="bg-[var(--spacespot-calendar-detail-surface)] p-3 rounded-lg border border-[var(--spacespot-cyan-primary)]">
                <p className="text-[var(--spacespot-cyan-primary)] text-sm font-semibold mb-2">
                  Events on {selectedMonthName.split(" ")[0]} {selectedDate}
                </p>

                {selectedDateEvents.length === 0 ? (
                  <p className="text-[var(--spacespot-text-inverse-muted)] text-sm">
                    No events scheduled.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((event, index) => (
                      <div
                        key={`${event.title}-${index}`}
                        className={`rounded-lg p-3 border ${
                          event.type === "deadline"
                            ? "bg-[#2B0C12] border-[#EF4444]"
                            : "bg-[var(--spacespot-calendar-detail-accent)] border-[var(--spacespot-cyan-primary)]"
                        }`}
                      >
                        <p className="text-white font-semibold flex items-center gap-2">
                          {event.type === "deadline" ? (
                            <AlertCircle size={14} className="text-[#EF4444]" />
                          ) : (
                            <Star size={14} className="text-[#F9A826]" />
                          )}
                          {event.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[27px] font-normal mb-4 text-[var(--spacespot-text-primary)]">
          Space Availability Overview
        </h3>

        <div className="relative overflow-hidden rounded-[18px] border border-[rgba(20,216,204,0.35)] bg-[color:color-mix(in_srgb,var(--spacespot-card-surface)_82%,transparent)] p-6 shadow-[0_24px_38px_rgba(0,0,0,0.18)] backdrop-blur-[6px] transition-all duration-300">
          <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold">
              {(["monthly", "quarterly", "ytd"] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setAvailabilityView(view)}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                    availabilityView === view
                      ? "border-[var(--spacespot-cyan-primary)] bg-[var(--spacespot-cyan-primary)] text-[var(--spacespot-gray-900)]"
                      : "border-[var(--spacespot-card-border)] bg-[var(--spacespot-surface-secondary)] text-[var(--spacespot-text-secondary)]"
                  }`}
                >
                  {view === "ytd" ? "YTD" : view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid gap-6 sm:gap-8 items-end justify-items-center h-[300px] rounded-[14px] border border-[var(--spacespot-card-border)] bg-[color:color-mix(in_srgb,var(--spacespot-surface-secondary)_78%,transparent)] p-4 ${
              availabilityData.length <= 2 ? "grid-cols-2" : "grid-cols-6"
            }`}
          >
            {availabilityData.map((point, index) => {
              const availableHeight = getLollipopHeight(point.available);
              const rentedHeight = getLollipopHeight(point.rented);

             return (
                  <div
                      key={point.id ?? `${point.label}-${index}`}
                      className="group/point w-[130px] flex flex-col items-center gap-2"
                    >
                  <div className="h-[230px] w-full flex items-end justify-center gap-2">
                    {availabilitySeries.available && (
                      <div className="relative flex flex-col items-center justify-end h-[200px] w-11">
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[4px] rounded-full"
                          style={{
                            height: `${availableHeight}px`,
                            background: "var(--spacespot-chart-available)",
                          }}
                        />
                        <span className="absolute -top-3 text-[10px] font-semibold text-[var(--spacespot-text-secondary)]">
                          {point.available}
                        </span>
                      </div>
                    )}

                    {availabilitySeries.rented && (
                      <div className="relative flex flex-col items-center justify-end h-[200px] w-11">
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[4px] rounded-full"
                          style={{
                            height: `${rentedHeight}px`,
                            background: "var(--spacespot-chart-rented)",
                          }}
                        />
                        <span className="absolute -top-3 text-[10px] font-semibold text-[var(--spacespot-text-secondary)]">
                          {point.rented}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-14 h-[2px] rounded-full bg-[var(--spacespot-card-border)]" />
                  <div className="text-[12px] font-semibold text-[var(--spacespot-text-primary)]">
                    {point.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => toggleAvailabilitySeries("available")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5"
            >
              Available
            </button>

            <button
              type="button"
              onClick={() => toggleAvailabilitySeries("rented")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5"
            >
              Rented
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}