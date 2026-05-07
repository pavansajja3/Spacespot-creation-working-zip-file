import React, { useEffect, useMemo, useState } from "react";
import api from "../src/api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Circle,
  MapPin,
  Pencil,
  Search,
  Square,
  Trash2,
  Upload,
} from "lucide-react";

interface Space {
  id: string;
  name: string;
  location: string;
  address?: string;
  type: string;
  category?: string;
  floors: number;
  floor_count?: number;
  units: number;
  availableUnits: number;
  occupancy: number;
  status: string;
}

export default function ManageSpaces() {
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardFilter = location.state?.dashboardFilter;

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "draft" | "pending" | "approved" | "rejected"
  >("All");

  useEffect(() => {
    fetchMySpaces();
  }, []);

  const fetchMySpaces = async () => {
  try {
    const response = await api.get("/spaces");

    console.log("SPACES API RESPONSE:", response.data);

    const spacesArray =
      response.data?.data?.spaces ||
      response.data?.spaces ||
      response.data?.data ||
      [];

    const normalizedSpaces: Space[] = spacesArray.map((space: any) => ({
      id: String(space.id || space._id || space.space_id || ''),
      name: space.name || "Unnamed Space",
      location:
        space.location ||
        space.address ||
        `${space.city || ""}, ${space.state || ""}`.trim() ||
        "No location",
      address: space.address || "",
      type: space.type || space.property_type || space.category || "Space",
      category:  space.category ||  space.features?.category ||  space.property_type ||  space.type ||  "N/A",
      floors: Number(
          space.floor_count ||
          space.floors_count ||
          space.floors?.length ||
          0
        ),

        units: Number(
          space.total_units ||
          space.units_count ||
          space.units ||
          0
        ),

        availableUnits: Number(
          space.available_units ||
          space.availableUnits ||
          space.available_units_count ||
          0
        ),
      occupancy: Number(
          space.occupancy ??
            (Number(space.total_units || space.units_count || space.units || 0) > 0
              ? Math.round(
                  ((Number(space.total_units || space.units_count || space.units || 0) -
                    Number(space.available_units || space.availableUnits || space.available_units_count || 0)) /
                    Number(space.total_units || space.units_count || space.units || 0)) *
                    100
                )
              : 0)
        ),
      status: String(space.status || "pending").toLowerCase() === "active"
      ? "approved"
      : String(space.status || "pending").toLowerCase(),
        }));

    setSpaces(normalizedSpaces);
  } catch (error) {
    console.error("Failed to fetch spaces:", error);
    setSpaces([]);
  }
};

  const handleEdit = (id: string) => {
    navigate(`/manage/edit-space/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this space?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/spaces/${id}`);
      setSpaces((prev) => prev.filter((space) => space.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete space");
    }
  };

  const filteredSpaces = useMemo(() => {
      return spaces.filter((space) => {
        if (dashboardFilter === "available") {
          return true; // show all spaces
        }

        if (dashboardFilter === "rented") {
          return space.status === "approved";
        }

        if (dashboardFilter === "leases") {
          return space.status === "approved";
        }

        if (dashboardFilter === "precinct") {
          return space.type === "Precinct" || space.category === "Precinct";
        }

        const query = searchTerm.toLowerCase();

        const matchesSearch =
          (space.name || "").toLowerCase().includes(query) ||
          (space.location || "").toLowerCase().includes(query) ||
          (space.type || "").toLowerCase().includes(query) ||
          String(space.id || "").toLowerCase().includes(query);

        const matchesFilter =
          activeFilter === "All" || space.status === activeFilter;

        return matchesSearch && matchesFilter;
      });
    }, [spaces, searchTerm, activeFilter, dashboardFilter]);

  const totals = useMemo(() => {
    return {
      totalSpaces: spaces.length,
      approvedSpaces: spaces.filter((space) => space.status === "approved")
        .length,
      totalUnits: spaces.reduce(
        (sum, space) => sum + Number(space.units || 0),
        0
      ),
      availableUnits: spaces.reduce(
        (sum, space) => sum + Number(space.availableUnits || 0),
        0
      ),
    };
  }, [spaces]);

  const getStatusStyle = (status: string) => {

  // ✅ ADD THIS BLOCK FIRST
  if (status === "draft") {
    return {
      color: "#6b7280",
      backgroundColor: "#f3f4f6",
      border: "1px solid #d1d5db",
    };
  }

  if (status === "approved") {
    return {
      color: "green",
      backgroundColor: "#e6fffa",
      border: "1px solid #8be0d4",
    };
  }

  if (status === "pending") {
    return {
      color: "#b7791f",
      backgroundColor: "#fff7e6",
      border: "1px solid #f6d365",
    };
  }

  if (status === "rejected") {
    return {
      color: "#c53030",
      backgroundColor: "#fff5f5",
      border: "1px solid #feb2b2",
    };
  }

  return {
    color: "gray",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
  };
};

  const getProgressColor = (occupancy: number) => {
    if (occupancy >= 100) return "var(--spacespot-cyan-primary)";
    if (occupancy > 0) return "var(--spacespot-cyan-dark)";
    return "var(--spacespot-gray-300)";
  };

  return (
    <div
      style={{
        padding: "16px 18px 20px",
        backgroundColor: "var(--spacespot-gray-50)",
        minHeight: "100vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1080px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              title="Back"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "1px solid var(--spacespot-cyan-primary)",
                backgroundColor: "var(--spacespot-white)",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={18} />
            </button>

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--spacespot-cyan-primary)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Building2 size={17} color="#ffffff" />
            </div>

            <div>
              <h1 style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>
                Manage Spaces
              </h1>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--spacespot-gray-500)",
                  margin: "2px 0 0",
                }}
              >
                View and manage your spaces
              </p>
              <div
                style={{
                  width: "56px",
                  height: "2px",
                  backgroundColor: "var(--spacespot-cyan-primary)",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
            <button
              type="button"
              style={{
                border: "none",
                backgroundColor: "var(--spacespot-navy-primary)",
                borderRadius: "8px",
                color: "white",
                fontSize: "11px",
                height: "28px",
                padding: "0 9px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              My Spaces <ChevronDown size={14} />
            </button>

            <button
                type="button"
                onClick={() => navigate("/create/space")}
                style={{
                  border: "none",
                  backgroundColor: "var(--spacespot-navy-primary)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "11px",
                  height: "28px",
                  padding: "0 12px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                + Add New Space
              </button>
          </div>
        </div>
        <div
          style={{
            border: "1.5px solid var(--spacespot-cyan-primary)",
            borderRadius: "8px",
            padding: "10px 12px",
            backgroundColor: "white",
            marginBottom: "10px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "10px",
          }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search by space name, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                height: "30px",
                border: "1px solid var(--spacespot-gray-300)",
                borderRadius: "7px",
                padding: "0 10px 0 30px",
                fontSize: "11px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {(["All", "draft", "pending", "approved", "rejected"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    borderRadius: "7px",
                    border:
                      activeFilter === filter
                        ? "1px solid var(--spacespot-cyan-primary)"
                        : "1px solid var(--spacespot-gray-300)",
                    backgroundColor:
                      activeFilter === filter
                        ? "var(--spacespot-cyan-primary)"
                        : "white",
                    color:
                      activeFilter === filter
                        ? "white"
                        : "var(--spacespot-gray-500)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "10px",
                    height: "30px",
                    padding: "0 10px",
                  }}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {[
            {
              title: "Total Spaces",
              value: totals.totalSpaces,
              icon: Building2,
            },
            {
              title: "Approved",
              value: totals.approvedSpaces,
              icon: Circle,
            },
            {
              title: "Total Units",
              value: totals.totalUnits,
              icon: Square,
            },
            {
              title: "Available Units",
              value: totals.availableUnits,
              icon: Building2,
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: "white",
                border: "1.5px solid var(--spacespot-cyan-300)",
                borderRadius: "8px",
                padding: "10px",
                minHeight: "56px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--spacespot-gray-500)",
                    marginBottom: "6px",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "27px",
                    fontWeight: 700,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  {card.value}
                </div>
              </div>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "8px",
                  backgroundColor: "var(--spacespot-cyan-pale)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <card.icon size={13} />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "white",
            border: "1.5px solid var(--spacespot-cyan-primary)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderBottom: "1px solid var(--spacespot-gray-200)",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700 }}>
              Space List ({filteredSpaces.length})
            </div>

            <button
              type="button"
              style={{
                border: "1px solid var(--spacespot-gray-300)",
                backgroundColor: "var(--spacespot-gray-50)",
                borderRadius: "8px",
                fontSize: "10px",
                height: "24px",
                padding: "0 9px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Upload size={12} /> Export
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--spacespot-gray-50)",
                  borderBottom: "1px solid var(--spacespot-gray-200)",
                }}
              >
                <th style={thStyle}>SPACE</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>STRUCTURE</th>
                <th style={thStyle}>OCCUPANCY </th>
                <th style={thStyle}>STATUS</th>
                
              </tr>
            </thead>

            <tbody>
              {filteredSpaces.length > 0 ? (
                filteredSpaces.map((space) => (
                  <tr
                    key={space.id}
                    style={{
                      borderBottom: "1px solid var(--spacespot-gray-100)",
                    }}
                  >
                    <td style={tdStyle}>
                      <strong>{space.name}</strong>
                      <div style={{ fontSize: "8px", color: "#777" }}>
                        ID: {space.id}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <MapPin size={10} />
                        {space.location}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
                          fontSize: "8px",
                          borderRadius: "999px",
                          padding: "2px 6px",
                          backgroundColor: "var(--spacespot-cyan-pale)",
                        }}
                      >
                        {space.type}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {space.category || "N/A"}
                    </td>

                    <td style={tdStyle}>
                      <div>Floors: {space.floors}</div>
                      <div>Units: {space.units}</div>
                      <div>{space.availableUnits} Available</div>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          height: "8px",
                          borderRadius: "999px",
                          backgroundColor: "var(--spacespot-gray-100)",
                          overflow: "hidden",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          style={{
                            width: `${space.occupancy}%`,
                            height: "100%",
                            backgroundColor: getProgressColor(space.occupancy),
                          }}
                        />
                      </div>

                      <div style={{ fontSize: "9px", fontWeight: 600 }}>
                        {space.occupancy}%
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: "8px",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          ...getStatusStyle(space.status),
                        }}
                      >
                        {space.status}
                      </span>

                      {space.status === "draft" && (
                        <div
                          style={{
                            display: "inline-flex",
                            gap: "8px",
                            marginLeft: "10px",
                            verticalAlign: "middle",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(space.id)}
                            style={actionButtonStyle}
                            title="Edit draft"
                          >
                            <Pencil size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(space.id)}
                            style={actionButtonStyle}
                            title="Delete draft"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "var(--spacespot-gray-500)",
                    }}
                  >
                    No spaces found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px",
  textAlign: "left",
  fontSize: "9px",
  color: "var(--spacespot-gray-400)",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  fontSize: "10px",
};

const actionButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  padding: 0,
  color: "var(--spacespot-gray-400)",
  cursor: "pointer",
};