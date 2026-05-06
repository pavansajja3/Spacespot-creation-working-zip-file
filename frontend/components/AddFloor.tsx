import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../src/api/axios.js";
export default function AddFloor() {
  const navigate = useNavigate();
  const { spaceId } = useParams();

  const [formData, setFormData] = useState({
    floor_name: "",
    floor_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spaceId) {
      alert("Space ID missing");
      return;
    }

    try {
      const payload = {
        floor_name: formData.floor_name,
        floor_number: Number(formData.floor_number),
        space_id: Number(spaceId),
      };

      console.log("Creating floor:", payload);

      const response = await api.post("/floors", payload);

      console.log("Floor created:", response.data);

      alert("Floor created successfully");
      navigate(`/manage/edit-space/${spaceId}`);
    } catch (error) {
      console.error("Failed to create floor:", error);
      alert("Failed to create floor");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Add Floor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Floor Name</label>
          <input
            type="text"
            name="floor_name"
            value={formData.floor_name}
            onChange={handleChange}
            placeholder="Example: Ground Floor"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Floor Number</label>
          <input
            type="number"
            name="floor_number"
            value={formData.floor_number}
            onChange={handleChange}
            placeholder="Example: 1"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-cyan-500 text-white px-4 py-2 rounded"
        >
          Save Floor
        </button>
      </form>
    </div>
  );
}