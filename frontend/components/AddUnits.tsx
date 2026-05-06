import React, { useEffect, useState } from "react";
import { Bot, Building2, Edit3, MapPin, Sparkles, Wand2, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../src/api/axios";

type LocationState = {
  spaceId?: string;
};

export default function AddUnits() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const selectedId =
    state.spaceId || localStorage.getItem("selectedSpaceId");

  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpace = async () => {
      if (!selectedId) {
        navigate("/create/units");
        return;
      }

      localStorage.setItem("selectedSpaceId", selectedId);

      try {
        const response = await api.get(`/spaces/${selectedId}`);
        const spaceData = response.data?.data || response.data;
        setSpace(spaceData);
      } catch (error) {
        console.error("Failed to fetch selected space:", error);
        navigate("/create/units");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [selectedId, navigate]);

  if (loading) return <div>Loading selected space...</div>;
  if (!space) return <div>No space found</div>;

  return (
    <div style={{ padding: "12px 10px 20px", backgroundColor: "#eef2f6", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>

        {/* 🔹 Back Button */}
        <button
          type="button"
          onClick={() =>
            navigate("/create/units", {
              state: { spaceId: selectedId },
            })
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "none",
            background: "transparent",
            color: "#7b8da2",
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          <ArrowLeft size={14} /> Back to Units
        </button>

        {/* 🔹 Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              backgroundColor: "var(--spacespot-cyan-primary)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 10px rgba(20, 216, 204, 0.2)",
            }}
          >
            <Building2 size={16} color="#fff" />
          </div>

          <div style={{ fontSize: "22px", fontWeight: 600 }}>
            Add Units to Space
          </div>
        </div>

        {/* 🔹 Space Info */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1.5px solid #9fe5df",
            borderRadius: "8px",
            padding: "10px 12px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <div>
            <div>SPACE ID</div>
            <strong>{space.id}</strong>
          </div>

          <div>
            <div>SPACE NAME</div>
            <strong>{space.name}</strong>
          </div>

          <div>
            <div>TYPE</div>
            <span>{space.type || "Space"}</span>
          </div>

          <div>
            <div>LOCATION</div>
            <span>{space.address || "No location"}</span>
          </div>
        </div>

        {/* 🔹 Options */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h2>Choose Your Approach</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          
          {/* Auto */}
          <button
            onClick={() =>
              navigate("/create/units/auto-generated", {
                state: { spaceId: space.id },
              })
            }
          >
            Auto Generate Units
          </button>

          {/* Manual */}
          <button
            onClick={() =>
              navigate("/create/units/manual-add", {
                state: {
                  spaceId: space.id,
                  spaceName: space.name,
                },
              })
            }
          >
            Manually Add Units
          </button>
        </div>
      </div>
    </div>
  );
}