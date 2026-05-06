import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../src/api/services";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!token) {
        alert("Reset token missing");
        return;
      }

      await authService.resetPassword(token, newPassword);

      alert("Password reset successful");
      navigate("/login");
    } catch (error: any) {
      console.error("RESET PASSWORD ERROR:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Reset failed"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 40 }}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button type="submit">Reset Password</button>
    </form>
  );
}