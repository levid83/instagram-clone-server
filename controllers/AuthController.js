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
    if (name.length < 1) {
      return res.status(422).json({ error: "Please enter your name" });
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return res.status(422).json({ error: "Invalid email address" });
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
        password
      )
    ) {
      return res.status(422).json({ error: "Password is too weak" });
    }
    if (!picture) {
      return res.status(422).json({ error: "Missing profile picture" });
    }
    try {
      const duplicatedUser = await User.findOne({ email });
      if (duplicatedUser) {
        return res.status(422).json({ error: "Invalid credentials" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        picture,
      });

      await newUser.save();
      return res
        .status(201)
        .json({ message: "You have been successfully signed up" });
    } catch (err) {
      return res
        .status(403)
        .json({ error: "Couldn't sign up. Please try again." });
    }
  }

  async signin(req, res) {
    const { password, email: userEmail } = req.body;
    if (!userEmail || !password) {
      return res.status(422).json({ error: "Email or password is missing" });
    }
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(422).json({ error: "Invalid credentials" });
      }

      const doMatch = await bcrypt.compare(password, user.password);

      if (!doMatch) {
        return res.status(422).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const { _id, name, email, followers, following, picture } = user;
      return res.json({
        token,
        user: { _id, name, email, followers, following, picture },
      });
    } catch (err) {
      return res
        .status(403)
        .json({ error: "Couldn't sign in. Please try again." });
    }
  }

  async _sendPasswordResetEmail(user, token) {}

  async resetPassword(req, res) {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return res.status(422).json({
          error: "Couldn't reset your password. Please try again.",
        });
      }
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
      return res.json({ message: "Please check your email" });
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

      return res.json({
        message: "Your password has been successfully updated",
      });
    } catch (err) {
      return res
        .status(422)
        .json({ error: "Error on password reset. Please try again." });
    }
  }
}

export default AuthController;
