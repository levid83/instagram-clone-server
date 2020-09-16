import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

class AuthController {
  async signup(req, res) {
    const { name, email, password, picture } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    try {
      const duplicatedUser = await User.findOne({ email });
      if (duplicatedUser) {
        return res.status(422).json({ error: "invalid credentials" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        picture,
      });

      await newUser.save();
      res.status(201).json({ message: "saved successfully" });
    } catch (err) {
      console.log(err);
    }
  }

  async signin(req, res) {
    const { password, email: userEmail } = req.body;
    if (!userEmail || !password) {
      return res.status(422).json({ error: "email or password is missing" });
    }
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(422).json({ error: "invalid credentials" });
      }

      const doMatch = await bcrypt.compare(password, user.password);

      if (!doMatch) {
        return res.status(422).json({ error: "invalid credentials" });
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { id, name, email, followers, following, picture } = user;
      res.json({
        token,
        user: { id, name, email, followers, following, picture },
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default AuthController;
