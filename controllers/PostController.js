import Post from "../models/post";

class PostController {
  async createPost(req, res) {
    const { title, body, picture } = req.body;
    if (!title) {
      return res.status(422).json({ error: "Title is missing" });
    }
    if (!body) {
      return res.status(422).json({ error: "Post content is missing" });
    }
    if (!picture) {
      return res.status(422).json({ error: "Picture is missing" });
    }
    const post = new Post({
      title,
      body,
      photo: picture,
      postedBy: req.user,
    });
    try {
      const newPost = await post.save();
      return res.status(201).json({ post: newPost });
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async myPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");

      if (!posts) return res.json({ posts: [] });
      return res.json({ posts });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }

  async allPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
      if (!posts) return res.json({ posts: [] });
      return res.json({ posts });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }

  async subPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
      if (!posts) return res.json({ posts: [] });
      return res.json({ posts });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  }
  async addPostComment(req, res) {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    try {
      const result = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
      return res.json(result);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async deletePost(req, res) {
    try {
      const result = await Post.deleteOne({
        _id: req.params.postId,
        postedBy: req.user._id,
      });
      if (result.deletedCount != 1)
        return res.status(422).json({ error: "post cannot be deleted" });
      return res.json({ postId: req.params.postId });
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async likePost(req, res) {
    try {
      const post = await Post.findOneAndUpdate(
        {
          _id: req.body.postId,
          likes: { $not: { $elemMatch: { $eq: req.user._id } } },
        },
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
      return res.json(post);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async unlikePost(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $pull: { likes: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");
      return res.json(post);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }
}

export default PostController;
