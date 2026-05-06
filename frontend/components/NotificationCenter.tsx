import React, { useState } from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface Event {
  id: string;
  title: string;
  type: "important" | "today" | "deadline" | "selected";
  date: string;
  time?: string;
  category?: string;
}

export default function NotificationCenter() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "important" | "today" | "deadline" | "selected">("selected");

  const events: Event[] = [
    {
      id: "1",
      title: "Board Meeting - Q1 Review",
      type: "important",
      date: "February 18",
      category: "Important Event",
    },
    {
      id: "2",
      title: "Quarterly Planning Session",
      type: "selected",
      date: "February 20",
      category: "Team Meeting",
    },
    {
      id: "3",
      title: "Payment Deadline",
      type: "deadline",
      date: "February 15",
      category: "Financial",
    },
    {
      id: "4",
      title: "Daily Standup",
      type: "today",
      date: "Today",
      category: "Daily Task",
    },
  ];

  const filterColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    selected: { bg: "#f0fffe", border: "var(--spacespot-cyan-primary)", text: "var(--spacespot-cyan-primary)", icon: "●" },
    today: { bg: "#f9fafb", border: "#6b7280", text: "#6b7280", icon: "◯" },
    deadline: { bg: "#fef2f2", border: "#dc2626", text: "#dc2626", icon: "⚠" },
    important: { bg: "#f0fef9", border: "var(--spacespot-cyan-primary)", text: "var(--spacespot-cyan-primary)", icon: "★" },
  };

  const filteredEvents =
    selectedFilter === "all" ? events : events.filter((e) => e.type === selectedFilter);

  const getEventColor = (type: string): { bg: string; border: string; text: string; icon: string } => {
    return filterColors[type] || filterColors.selected;
  };

  return (
    <div data-node-id="379:1017" style={{ maxWidth: "400px" }}>
      <Card
        style={{
          padding: "16px",
          border: "2px solid var(--spacespot-cyan-primary)",
        }}
      >
        {/* Filter Badges */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {[
            { label: "Selected", value: "selected", icon: "●" },
            { label: "Today", value: "today", icon: "○" },
            { label: "Deadline", value: "deadline", icon: "⚠" },
            { label: "Important", value: "important", icon: "★" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value as any)}
              style={{
                padding: "6px 10px",
                borderRadius: "16px",
                border: `1.5px solid ${getEventColor(filter.value).border}`,
                background: selectedFilter === filter.value ? getEventColor(filter.value).bg : "white",
                color: getEventColor(filter.value).text,
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.style as any).background = getEventColor(filter.value).bg;
              }}
              onMouseLeave={(e) => {
                if (selectedFilter !== filter.value) {
                  (e.currentTarget.style as any).background = "white";
                }
              }}
            >
              <span style={{ fontSize: "10px" }}>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div>
          {filteredEvents.length > 0 && (
            <>
              {/* Section Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                <span style={{ fontSize: "14px" }}>📅</span>
                Events on {filteredEvents[0].date}
              </div>

              {/* Event Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredEvents.map((event) => {
                  const colors = getEventColor(event.type);
                  return (
                    <div
                      key={event.id}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border}`,
                        background: colors.bg,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget.style as any).boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                        (e.currentTarget.style as any).transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget.style as any).boxShadow = "none";
                        (e.currentTarget.style as any).transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        {/* Icon */}
                        <div
                          style={{
                            fontSize: "12px",
                            color: colors.text,
                            fontWeight: "bold",
                            minWidth: "16px",
                          }}
                        >
                          {event.type === "important" && "★"}
                          {event.type === "today" && "◉"}
                          {event.type === "deadline" && "⚠"}
                          {event.type === "selected" && "✓"}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#1f2937",
                              wordBreak: "break-word",
                            }}
                          >
                            {event.title}
                          </h4>
                          {event.category && (
                            <div style={{ marginTop: "4px" }}>
                              <Badge
                                style={{
                                  fontSize: "10px",
                                  padding: "3px 6px",
                                  background: colors.bg,
                                  color: colors.text,
                                  border: `0.5px solid ${colors.border}`,
                                }}
                              >
                                {event.category}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {filteredEvents.length === 0 && (
            <div
              style={{
                padding: "24px 12px",
                textAlign: "center",
                color: "#9ca3af",
                fontSize: "12px",
              }}
            >
              No events found for this filter
            </div>
          )}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: "12px" }}>
          <button
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: "var(--spacespot-navy-primary)",
              color: "white",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget.style as any).opacity = "0.9")}
            onMouseLeave={(e) => ((e.currentTarget.style as any).opacity = "1")}
          >
            View All Notifications
          </button>
        </div>
      </Card>
    </div>
  );
}

