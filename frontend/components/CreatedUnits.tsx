import React from "react";
import { ArrowLeft, CheckCircle2, ChevronDown, ListChecks, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type CreatedUnit = {
  id?: string;
  name?: string;
  floor?: string;
  area?: string;
  status?: string;
  spaceId?: string;
  spaceName?: string;
};

type LocationState = {
  spaceId?: string;
  spaceName?: string;
};

export default function CreatedUnits() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // ✅ Fix: always take latest selected space
  const spaceId =
    state.spaceId || localStorage.getItem("selectedSpaceId") || "";
  const spaceName = state.spaceName || "Selected Space";

  // ✅ Fix: safe parsing
  const allUnits: CreatedUnit[] = JSON.parse(
    localStorage.getItem("createdUnits") || "[]"
  );

  // ✅ Filter units based on selected space
  const units = allUnits.filter(
    (unit) => String(unit.spaceId) === String(spaceId)
  );

  const cellStyle: React.CSSProperties = {
    padding: "8px",
    fontSize: "10px",
    color: "var(--spacespot-navy-primary)",
    borderBottom: "1px solid #edf2f7",
  };

  return (
    <div style={{ padding: "12px 10px 20px", backgroundColor: "#eef2f6", minHeight: "100%" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        
        {/* 🔙 BACK BUTTON FIXED */}
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() =>
              navigate("/root", {
                state: {
                  child: "createunits",
                  spaceId,
                  spaceName,
                },
              })
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "none",
              background: "transparent",
              color: "#1e293b",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            Back to Units
          </button>
        </div>

        {/* FILTER BUTTON */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            type="button"
            style={{
              border: "1px solid #d0dae5",
              backgroundColor: "#1e2f46",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "11px",
              height: "28px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #9fe5df",
            borderRadius: "8px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <CheckCircle2 size={14} color="var(--spacespot-cyan-primary)" />
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700 }}>
              Unit Created Successfully
            </div>
            <div style={{ fontSize: "9px", color: "#7f8ea1" }}>
              Review your created units and add more if needed
            </div>
          </div>
        </div>

        {/* SPACE DETAILS */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #9fe5df",
            borderRadius: "8px",
            padding: "10px 12px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <div>
            <div style={{ fontSize: "8px", color: "#8ea0b4" }}>SPACE ID</div>
            <div style={{ fontSize: "22px", fontWeight: 700 }}>
              {spaceId || "-"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "8px", color: "#8ea0b4" }}>SPACE NAME</div>
            <div style={{ fontSize: "20px", fontWeight: 600 }}>
              {spaceName}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1.5px solid #9fe5df",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
            <ListChecks size={12} />
            <span style={{ fontSize: "12px", fontWeight: 700 }}>
              Created Units ({units.length})
            </span>
          </div>

          <table style={{ width: "100%" }}>
            <tbody>
              {units.length === 0 ? (
                <tr>
                  <td style={{ textAlign: "center" }}>
                    No units created for this space yet.
                  </td>
                </tr>
              ) : (
                units.map((unit, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{unit.id}</td>
                    <td style={cellStyle}>{unit.name}</td>
                    <td style={cellStyle}>{unit.floor}</td>
                    <td style={cellStyle}>{unit.area}</td>
                    <td style={cellStyle}>{unit.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
            
            {/* ✅ FIX: pass spaceId properly */}
            <button
              onClick={() =>
                navigate("/root", {
                  state: {
                    child: "manualaddunit",
                    spaceId,
                    spaceName,
                  },
                })
              }
            >
              <Plus size={11} /> Add More Units
            </button>

            <button
              onClick={() =>
                navigate("/root", {
                  state: { child: "managespaces" },
                })
              }
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}