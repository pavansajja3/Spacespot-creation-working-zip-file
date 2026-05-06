import NotificationCenter from "./NotificationCenter";

export default function NotificationCenterPage() {
  return (
    <div style={{ padding: "24px 28px", maxWidth: "1200px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--spacespot-navy-primary)", marginBottom: "24px" }}>
        Notification Center
      </h1>
      <div style={{ maxWidth: "500px" }}>
        <NotificationCenter />
      </div>
    </div>
  );
}

