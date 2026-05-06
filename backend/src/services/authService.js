
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    if (!user.is_active) {
      throw new Error("User account is inactive");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    await User.update(
      { last_login_at: new Date() },
      { where: { id: user.id } }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  static async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      password_hash: hashedPassword,
      role: userData.role || "customer",
      is_active: true,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  static async refreshToken(token) {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      throw new Error("Invalid or expired token");
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    

    return { token: newToken };
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    await user.update({
      reset_token: resetToken,
      reset_token_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      resetToken,
      resetLink: `http://localhost:5173/reset-password/${resetToken}`,
    };
  }

  static async resetPassword(token, newPassword) {
  const user = await User.findOne({
    where: { reset_token: token },
  });

  if (!user) {
    throw new Error("Invalid reset token");
  }

  if (!user.reset_token_expiry) {
    throw new Error("Reset token expired");
  }

  const expiryTime = new Date(user.reset_token_expiry).getTime();
  const now = Date.now();

  if (expiryTime + 5000 < now) {
    throw new Error("Reset token expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password_hash: hashedPassword,
    reset_token: null,
    reset_token_expiry: null,
  });

  return true;
}
}

module.exports = AuthService;