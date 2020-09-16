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
        .populate("postedBy", "id name")
        .exec();
      return res.json({ user, posts });
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }
}

export default UserController;
