import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(password))) {
      const err = new Error("Credenciales incorrectas");
      err.status = 401;
      throw err;
    }

    if (!user.active) {
      const err = new Error("Usuario inactivo");
      err.status = 403;
      throw err;
    }

    return {
      token: signToken(user),
      user: toPublicUser(user),
    };
  },

  me: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const err = new Error("Usuario no encontrado");
      err.status = 404;
      throw err;
    }
    return toPublicUser(user);
  },
};
