import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../src/api/services";

console.log("AUTH SERVICE:", authService);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await authService.forgotPassword(email);

      alert("Reset link: " + res.data.resetLink);
      navigate("/login");
    } catch (error: any) {
      console.error("FORGOT PASSWORD ERROR:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Error sending reset link"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 40 }}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Send Reset Link</button>
    </form>
  );
}