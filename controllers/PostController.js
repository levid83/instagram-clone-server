import Post from "../models/post";

class PostController {
  async createPost(req, res) {
    const { title, body, picture } = req.body;
    if (!title || !body || !picture) {
      return res.status(422).json({ error: "Plase add all the fields" });
    }
    const post = new Post({
      title,
      body,
      photo: picture,
      postedBy: req.user,
    });
    try {
      const newPost = await post.save();
      res.status(201).json({ post: newPost });
    } catch (err) {
      console.log(err);
    }
  }

  async myPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: req.user.id })
        .populate("postedBy", "id name")
        .exec();
      res.json({ posts });
    } catch (err) {
      console.log(err);
    }
  }
}

export default PostController;
