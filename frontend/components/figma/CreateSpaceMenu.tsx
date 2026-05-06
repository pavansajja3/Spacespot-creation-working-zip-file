import { Link } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";
import { createSpaceMenuIcon, createSpaceMenuIcon1, createSpaceMenuIcon2, createSpaceMenuIcon3 } from "./assets";

interface CreateSpaceMenuProps {
  onItemClick?: (item: string) => void;
}

export function CreateSpaceMenu({ onItemClick }: CreateSpaceMenuProps) {
  const menuItems = [
    { label: "Space", icon: createSpaceMenuIcon, href: "/create/space", highlight: true },
    { label: "Unit", icon: createSpaceMenuIcon1, href: "/create/units" },
    { label: "Lease", icon: createSpaceMenuIcon1, href: "/create/lease" },
    { label: "Customer", icon: createSpaceMenuIcon2, href: "/create/customer" },
    { label: "Documents", icon: createSpaceMenuIcon3, href: "/create/documents" },
  ];

  return (
    <div
      className="rounded-lg shadow-md"
      style={{
        backgroundColor: "var(--spacespot-navy-primary)",
        borderColor: "var(--spacespot-cyan-primary)",
        borderWidth: "1.778px",
        width: "120px",
        padding: "12px",
      }}
      data-name="Create Space Menu"
      data-node-id="379:2573"
    >
      <p style={{ color: "white", fontSize: "14px", marginBottom: "12px" }}>
        Create
      </p>

      <div style={{ borderTopColor: "rgba(20,216,204,0.3)", borderTopWidth: "0.889px", paddingTop: "8px" }}>
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.href}
            onClick={() => onItemClick?.(item.label)}
            className="flex items-center gap-2 py-2 px-1 hover:opacity-80 transition-opacity"
            style={{
              color: item.highlight ? "var(--spacespot-cyan-primary)" : "white",
              textDecoration: "none",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <div style={{ width: "16px", height: "16px", flexShrink: 0 }}>
              <ImageWithFallback src={item.icon} alt={item.label} style={{ width: "100%", height: "100%" }} />
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CreateSpaceMenu;

