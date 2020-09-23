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
      const posts = await Post.find({ postedBy: req.user.id })
        .populate("postedBy", "id name")
        .exec();
      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
  }

  async allPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate("postedBy", "id name")
        .populate("comments.postedBy", "id name")
        .sort("-createdAt")
        .exec();
      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
  }

  async subPosts(req, res) {
    try {
      const posts = await Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "id name")
        .populate("comments.postedBy", "id name")
        .sort("-createdAt")
        .exec();
      return res.json({ posts });
    } catch (err) {
      console.log(err);
    }
    return res.json({ posts: [] });
  }
  async addPostComment(req, res) {
    const comment = {
      text: req.body.text,
      postedBy: req.user.id,
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
        .populate("comments.postedBy", "id name")
        .populate("postedBy", "id name")
        .exec();
      return res.json(result);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }

  async deletePost(req, res) {
    try {
      const result = await Post.deleteOne({
        _id: req.params.postId,
        postedBy: req.user.id,
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
      const post = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.user.id },
        },
        {
          new: true,
        }
      );
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
          $pull: { likes: req.user.id },
        },
        {
          new: true,
        }
      );
      return res.json(post);
    } catch (err) {
      return res.status(422).json({ error: err });
    }
  }
}

export default PostController;
