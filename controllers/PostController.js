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
      return res.status(201).json({ post: newPost });
    } catch (err) {
      console.log(err);
    }
  }

  async myPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");

      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
  }

  async allPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");

      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
  }

  async subPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt");

      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
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
      console.log(err);
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
