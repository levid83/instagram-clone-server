import bcrypt from "bcryptjs";

import User from "../models/user";

class AuthController {
  async signup(req, res) {
    const { name, email, password, picture } = req.body;
    if (!email || !password || !name) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    try {
      const duplicatedUser = await User.findOne({ email: email });
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
}

export default AuthController;
