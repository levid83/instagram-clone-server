import jwt from "jsonwebtoken";
import User from "../models/user";

const authGuard = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }
    const { id } = payload;
    try {
      req.user = await User.findById(id);
      req.user.password = undefined;
      next();
    } catch (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }
  });
};

export default authGuard;
