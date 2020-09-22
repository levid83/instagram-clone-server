import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/user";

var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

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
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const { id, name, email, followers, following, picture } = user;
      res.json({
        token,
        user: { id, name, email, followers, following, picture },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async _sendPasswordResetEmail(user, token) {}

  async resetPassword(req, res) {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) console.log(err);
      try {
        const token = buffer.toString("hex");
        const user = await User.findOne({ email: req.body.email });

        if (!user) throw new Error();

        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        await user.save();

        transporter.sendMail({
          to: user.email,
          from: "no-replay@test.com",
          subject: "Password reset",
          html: `<p>You requested for password reset</p>

             <h5>click <a href="${process.env.APP_HOST}/reset-password/${token}">here</a> to reset your password</h5>`,
        });
      } catch (err) {
        return res.status(422).json({
          error: "Couldn't reset your password. Please try again.",
        });
      }
      res.json({ message: "Please check your email" });
    });
  }

  async newPassword(req, res) {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    try {
      const user = await User.findOne({
        resetToken: sentToken,
        expireToken: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(422)
          .json({ error: "Session expired. Please try again." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;

      await user.save();

      res.json({ message: "Your password has been successfully updated" });
    } catch (err) {
      console.log(err);
    }
  }
}

export default AuthController;
