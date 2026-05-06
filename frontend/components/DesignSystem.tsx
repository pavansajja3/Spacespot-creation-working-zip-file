import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export default function DesignSystem() {
  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Header/Navigation Bar */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "2px solid var(--spacespot-cyan-primary)",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--spacespot-navy-primary)" }}>
          SpaceSpot Design System
        </div>
        <Button variant="primary">Get Started</Button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 32px" }}>
        {/* Title */}
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "16px", color: "var(--spacespot-navy-primary)" }}>
          SpaceSpot Design System
        </h1>
        <a
          href="/figma-35"
          style={{
            display: "inline-block",
            marginBottom: "40px",
            padding: "10px 18px",
            backgroundColor: "var(--spacespot-cyan-primary)",
            color: "white",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Open Figma 35 nodes gallery
        </a>

        {/* Color Palette Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Color Palette
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            {[
              { name: "Primary Navy", color: "var(--spacespot-navy-primary)", label: "Primary" },
              { name: "Primary Cyan", color: "var(--spacespot-cyan-primary)", label: "Accent" },
              { name: "Pale Cyan", color: "#E0F9F7", label: "Light" },
              { name: "White", color: "#FFFFFF", label: "Background", border: true },
              { name: "Warm Gray", color: "var(--spacespot-gray-500)", label: "Secondary" },
              { name: "Success", color: "#10B981", label: "Success" },
            ].map((color, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundColor: color.color,
                    borderRadius: "10px",
                    border: color.border ? "2px solid #6B7280" : "2px solid " + color.color,
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    marginBottom: "12px",
                  }}
                />
                <h4 style={{ margin: "8px 0 4px 0", fontWeight: "bold", color: "var(--spacespot-navy-primary)" }}>
                  {color.name}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>{color.color}</p>
                <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>{color.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Typography
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>Heading 1</h1>
              <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>48px / Bold / 1.5 line-height</p>
            </div>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>Heading 2</h2>
              <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>36px / Bold / 1.5 line-height</p>
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Heading 3</h3>
              <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>24px / Bold / 1.5 line-height</p>
            </div>
            <div>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>
                Body Text - The quick brown fox jumps over the lazy dog
              </p>
              <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>16px / Regular / 1.5 line-height</p>
            </div>
            <div>
              <small style={{ fontSize: "14px", color: "var(--spacespot-gray-500)" }}>
                Small Text - The quick brown fox jumps
              </small>
              <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>14px / Regular / 1.5 line-height</p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Buttons
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "var(--spacespot-navy-primary)" }}>
                Primary
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "var(--spacespot-navy-primary)" }}>
                Secondary
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", color: "var(--spacespot-navy-primary)" }}>
                Outline
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Cards
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            <Card variant="default" className="p-4">
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>Default Card</h3>
              <p style={{ fontSize: "14px", color: "var(--spacespot-gray-500)" }}>This is a default card with a simple border and shadow.</p>
            </Card>
            <Card variant="elevated" className="p-4">
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>Elevated Card</h3>
              <p style={{ fontSize: "14px", color: "var(--spacespot-gray-500)" }}>This is an elevated card with cyan border.</p>
            </Card>
            <Card variant="gradient" className="p-4">
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>Gradient Card</h3>
              <p style={{ fontSize: "14px", color: "var(--spacespot-gray-500)" }}>This is a gradient card with cyan accent.</p>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Badges
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Badge>Default Badge</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Spacing System Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Spacing System
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { px: 4, name: "xs" },
              { px: 8, name: "sm" },
              { px: 12, name: "md" },
              { px: 16, name: "lg" },
              { px: 24, name: "xl" },
              { px: 32, name: "2xl" },
            ].map((space, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ minWidth: "50px", fontSize: "12px", fontWeight: "bold" }}>{space.name}</div>
                <div
                  style={{
                    height: "24px",
                    width: space.px + "px",
                    backgroundColor: "var(--spacespot-cyan-primary)",
                    borderRadius: "4px",
                  }}
                />
                <span style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>{space.px}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "24px", color: "var(--spacespot-navy-primary)" }}>
            Border Radius
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "24px" }}>
            {[
              { name: "None", radius: "0px" },
              { name: "xs", radius: "4px" },
              { name: "sm", radius: "8px" },
              { name: "md", radius: "12px" },
              { name: "lg", radius: "16px" },
              { name: "full", radius: "9999px" },
            ].map((br, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    backgroundColor: "var(--spacespot-cyan-primary)",
                    borderRadius: br.radius,
                    marginBottom: "12px",
                  }}
                />
                <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "4px" }}>{br.name}</p>
                <p style={{ fontSize: "12px", color: "var(--spacespot-gray-500)" }}>{br.radius}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

