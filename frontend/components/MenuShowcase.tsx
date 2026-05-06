import { CreateSpaceMenu } from "./figma/CreateSpaceMenu";
import { ManageMenu } from "./figma/ManageMenu";

export default function MenuShowcase() {
  const handleCreateClick = (item: string) => {
    console.log(`Create > ${item} clicked`);
  };

  const handleManageClick = (item: string) => {
    console.log(`Manage > ${item} clicked`);
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "40px", color: "var(--spacespot-navy-primary)" }}>Menu Components</h1>

      <div style={{ display: "flex", gap: "60px" }}>
        <div>
          <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "var(--spacespot-navy-primary)" }}>
            Create Space Menu
          </h2>
          <CreateSpaceMenu onItemClick={handleCreateClick} />
        </div>

        <div>
          <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "var(--spacespot-navy-primary)" }}>
            Manage Menu
          </h2>
          <ManageMenu onItemClick={handleManageClick} />
        </div>
      </div>
    </div>
  );
}

