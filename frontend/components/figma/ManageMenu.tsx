import { Link } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";
import { manageMenuSubIcon, manageMenuSubIcon1, manageMenuSubIcon2, manageMenuSubIcon3, manageMenuSubIcon4 } from "./assets";

interface ManageMenuProps {
  onItemClick?: (item: string) => void;
}

export function ManageMenu({ onItemClick }: ManageMenuProps) {
  const menuItems = [
    { label: "Space", icon: manageMenuSubIcon, href: "/manage/spaces" },
    { label: "Unit", icon: manageMenuSubIcon1, href: "/manage/units" },
    { label: "Lease", icon: manageMenuSubIcon1, href: "/manage/leases" },
    { label: "Customer", icon: manageMenuSubIcon2, href: "/manage/customers" },
    { label: "Pricing", icon: manageMenuSubIcon3, href: "/manage/pricing" },
    { label: "Documents", icon: manageMenuSubIcon4, href: "/manage/documents" },
  ];

  return (
    <div
      className="rounded-lg shadow-md"
      style={{
        backgroundColor: "var(--spacespot-navy-primary)",
        borderColor: "var(--spacespot-cyan-primary)",
        borderWidth: "1.778px",
        width: "130px",
        padding: "12px",
      }}
      data-name="Manage Menu"
      data-node-id="500:8290"
    >
      <p style={{ color: "white", fontSize: "14px", marginBottom: "12px" }}>
        Manage
      </p>

      <div style={{ borderTopColor: "rgba(20,216,204,0.3)", borderTopWidth: "0.889px", paddingTop: "8px" }}>
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.href}
            onClick={() => onItemClick?.(item.label)}
            className="flex items-center gap-2 py-2 px-1 hover:opacity-80 transition-opacity"
            style={{
              color: "white",
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

export default ManageMenu;

