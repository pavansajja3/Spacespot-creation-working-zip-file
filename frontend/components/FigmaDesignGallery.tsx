import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { imgImageSpaceSpotCommercialLeaseManagement } from "./figma/assets";

const figmaNodeIds = [
  "379:2",
  "534:7929",
  "534:7176",
  "530:6548",
  "534:7459",
  "514:5555",
  "513:4221",
  "510:2733",
  "510:2651",
  "510:1151",
  "498:6820",
  "507:4539",
  "505:710",
  "507:2147",
  "507:7585",
  "488:4294",
  "505:1944",
  "509:577",
  "505:1222",
  "515:6103",
  "379:1017",
  "507:5475",
  "513:5105",
  "505:1005",
  "500:8290",
  "379:2573",
  "469:396",
  "505:1753",
  "498:5810",
  "505:2",
  "510:3219",
  "485:3260",
  "507:6243",
  "484:2763",
  "534:8422",
];

const nodeScreenshots: Record<string, string> = {
  "510:1151": imgImageSpaceSpotCommercialLeaseManagement,
  "505:710": imgImageSpaceSpotCommercialLeaseManagement,
  "500:8290": imgImageSpaceSpotCommercialLeaseManagement,
};

const nodeMetadata: Record<string, { name: string; category: string; status: string }> = {
  "379:2": { name: "Global KPI Panel", category: "Dashboard", status: "Released" },
  "534:7929": { name: "Revenue Trend Chart", category: "Chart", status: "Released" },
  "534:7176": { name: "Occupancy Overview", category: "Chart", status: "Released" },
  "530:6548": { name: "Space Availability Card", category: "Cards", status: "Released" },
  "534:7459": { name: "Lease Status Summary", category: "Cards", status: "Released" },
  "514:5555": { name: "Quick Action Toolbar", category: "Navigation", status: "Prototype" },
  "513:4221": { name: "Property Filter Input", category: "Form", status: "Released" },
  "510:2733": { name: "Historic Bookings", category: "Table", status: "Released" },
  "510:2651": { name: "Revenue Comparison", category: "Chart", status: "Released" },
  "510:1151": { name: "Main Dashboard Visual", category: "Hero", status: "Released" },
  "498:6820": { name: "Metrics Badge Set", category: "Components", status: "Released" },
  "507:4539": { name: "New Customer Modal", category: "Modal", status: "Prototype" },
  "505:710": { name: "Space Selector", category: "Cards", status: "Released" },
  "507:2147": { name: "Create Unit Wizard", category: "Workflow", status: "Prototype" },
  "507:7585": { name: "Invoice Summary", category: "Cards", status: "Released" },
  "488:4294": { name: "Calendar Widget", category: "Widget", status: "Released" },
  "505:1944": { name: "Quick Insights Card", category: "Dashboard", status: "Released" },
  "509:577": { name: "Search Bar", category: "Form", status: "Released" },
  "505:1222": { name: "Filter Dropdown", category: "Form", status: "Released" },
  "515:6103": { name: "Map View Tile", category: "Components", status: "Prototype" },
  "379:1017": { name: "Notification Center", category: "Widget", status: "Prototype" },
  "507:5475": { name: "Tenant Info Panel", category: "Card", status: "Released" },
  "513:5105": { name: "Lease Detail Table", category: "Table", status: "Released" },
  "505:1005": { name: "Documents Upload", category: "Form", status: "Released" },
  "500:8290": { name: "Manage Menu", category: "Navigation", status: "Prototype" },
  "379:2573": { name: "Create Menu Widget", category: "Navigation", status: "Released" },
  "469:396": { name: "Header Bar", category: "Layout", status: "Released" },
  "505:1753": { name: "Payment Overview", category: "Cards", status: "Released" },
  "498:5810": { name: "Task Progress List", category: "List", status: "Released" },
  "505:2": { name: "Overall Summary", category: "Dashboard", status: "Released" },
  "510:3219": { name: "Usage Analytics", category: "Chart", status: "Released" },
  "485:3260": { name: "Support Panel", category: "Panel", status: "Prototype" },
  "507:6243": { name: "Admin Settings", category: "Settings", status: "Prototype" },
  "484:2763": { name: "Cost Breakdown", category: "Chart", status: "Released" },
  "534:8422": { name: "Bottom Control Strip", category: "Navigation", status: "Released" },
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "10px",
  fontSize: "14px",
  outline: "none",
};

const statusToBadgeVariant = (status: string): "success" | "warning" | "info" => {
  if (status === "Released") return "success";
  if (status === "Prototype") return "warning";
  return "info";
};

const renderNodeScreenshot = (nodeId: string) => {
  const screenshotSrc = nodeScreenshots[nodeId];

  if (screenshotSrc) {
    return (
      <ImageWithFallback
        src={screenshotSrc}
        alt={`Figma screenshot for ${nodeId}`}
        style={{ width: "100%", borderRadius: "10px", border: "1px solid #e5e7eb", objectFit: "cover", minHeight: "150px" }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "150px",
        borderRadius: "10px",
        border: "1px dashed #cbd5e1",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontSize: "0.9rem",
        textAlign: "center",
        padding: "12px",
      }}
    >
      Screenshot pending from Figma (node {nodeId})
    </div>
  );
};

const renderNodeCard = (nodeId: string, index: number) => {
  const metadata = nodeMetadata[nodeId];
  const status = metadata?.status ?? "Draft";

  return (
    <Card key={nodeId} className="p-4 hoverable" data-node-id={nodeId}>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, color: "var(--spacespot-navy-primary)", fontSize: "1rem", fontWeight: 700 }}>
            {metadata?.name ?? `Figma Node ${nodeId}`}
          </h3>
          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "12px" }}>
            ID: {nodeId} | {metadata?.category ?? "Uncategorized"}
          </p>
        </div>
        <Badge variant={statusToBadgeVariant(status)}>{status}</Badge>
      </div>

      {renderNodeScreenshot(nodeId)}

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "#64748b" }}>
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>Card type</div>
          <div>{`Variant ${index % 7}`}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>Implementation status</div>
          <div>{status === "Released" ? "Production ready" : "Review in progress"}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="secondary"
          style={{ fontSize: "12px", padding: "6px 10px" }}
          onClick={() => window.open(`https://www.figma.com/file/Pl5f3wXLW5llIh9cdSH6I6/CLIPS_VenueOwner?node-id=${nodeId}`, "_blank")}
        >
          Open in Figma
        </Button>
      </div>
    </Card>
  );
};

export default function FigmaDesignGallery() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "30px" }}>
      <section style={{ marginBottom: "20px", padding: "16px", background: "white", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "var(--spacespot-navy-primary)", fontWeight: 700 }}>Figma 35 Design Nodes</h1>
        <p style={{ margin: "8px 0 0", color: "#64748b" }}>Each card includes an actual Figma screenshot or placeholder, plus node metadata and interaction.</p>

        <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "12px", color: "#475569" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Legend</div>
            <ul style={{ margin: "4px 0 0", paddingLeft: "16px" }}>
              <li>Node ID: Figma node reference</li>
              <li>Category: UI component class</li>
              <li>Screenshot: asset or placeholder</li>
              <li>Open in Figma: direct link to node</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Status labels</div>
            <div style={{ marginTop: 6 }}><Badge variant="success">Released</Badge> production ready</div>
            <div style={{ marginTop: 4 }}><Badge variant="warning">Prototype</Badge> needs validation</div>
            <div style={{ marginTop: 4 }}><Badge variant="info">Draft</Badge> work in progress</div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {figmaNodeIds.map((nodeId, index) => renderNodeCard(nodeId, index))}
      </div>
    </div>
  );
}

