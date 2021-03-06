import User from "../models/user";
import Post from "../models/post";

class UserController {
  async getUser(req, res) {
    let user, posts;
    try {
      user = await User.findOne({ _id: req.params.id }).select("-password");
    } catch (err) {
      return res.status(404).json({ error: "User not found" });
    }
    try {
      posts = await Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");

      return res.json({ user, posts });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }

  async searchUser(req, res) {
    try {
      let userPattern = new RegExp("^" + req.body.query);
      let users = await User.find({ email: { $regex: userPattern } }).select(
        "_id email"
      );
      return res.json(users);
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }

  async followUser(req, res) {
    try {
      await User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        {
          new: true,
        }
      );
    } catch (err) {
      return res.status(422).json({ error: err });
    }

    try {
      const result = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      ).select("-password");

      return res.json(result);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }
  async unfollowUser(req, res) {
    try {
      await User.findByIdAndUpdate(
        req.body.unfollowId,
        {
          $pull: { followers: req.user._id },
        },
        {
          new: true,
        }
      );
    } catch (err) {
      return res.status(422).json({ error: err });
    }

    try {
      const result = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      ).select("-password");

      return res.json(result);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async updatePicture(req, res) {
    try {
      const result = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { picture: req.body.picture } },
        { new: true }
      );
      return res.json(result);
    } catch (err) {
      return res.status(422).json({ error: "picture cannot be posted" });
    }
  }
}

export default UserController;
